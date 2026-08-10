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
        // le o header enviado pelo front
        String header = request.getHeader("Authorization");

        //valida e segue sem autenticar
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            //remove o prefixo e valida
            Claims claims = jwtService.validar(header.substring(7));

            //extrai papeis e converte
            List<SimpleGrantedAuthority> autorizacoes = papeis(claims).stream()
                    .map(papel -> new SimpleGrantedAuthority("ROLE_" + papel))
                    .toList();

            //cria objeto de autenticação        
            UsernamePasswordAuthenticationToken autenticacao = new UsernamePasswordAuthenticationToken(
                    claims.getSubject(),
                    null,
                    autorizacoes
            );
            //registra a autenticação
            SecurityContextHolder.getContext().setAuthentication(autenticacao);
        } catch (RuntimeException exception) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    //extrai a lista de papeis 
    @SuppressWarnings("unchecked")
    private List<String> papeis(Claims claims) {
        Object papeis = claims.get("papeis");
        return papeis instanceof List<?> lista
                ? lista.stream().map(String::valueOf).toList()
                : List.of();
    }
}
