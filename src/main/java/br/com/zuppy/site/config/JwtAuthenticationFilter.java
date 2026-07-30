package br.com.zuppy.site.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = jwtService.validar(header.substring(7));
            List<SimpleGrantedAuthority> autorizacoes = papeis(claims).stream()
                    .map(papel -> new SimpleGrantedAuthority("ROLE_" + papel))
                    .toList();

            UsernamePasswordAuthenticationToken autenticacao = new UsernamePasswordAuthenticationToken(
                    claims.getSubject(),
                    null,
                    autorizacoes
            );
            SecurityContextHolder.getContext().setAuthentication(autenticacao);
        } catch (RuntimeException exception) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    @SuppressWarnings("unchecked")
    private List<String> papeis(Claims claims) {
        Object papeis = claims.get("papeis");
        return papeis instanceof List<?> lista
                ? lista.stream().map(String::valueOf).toList()
                : List.of();
    }
}
