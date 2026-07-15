package br.com.zuppy.site.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

// Cria e valida o token JWT (o "crachá" que prova que o usuário está logado)
@Service
public class JwtService {

    private final SecretKey chave;       // chave secreta que assina o token
    private final long expiracaoMs;      // tempo de vida do token

    public JwtService(
            @Value("${security.jwt.secret}") String segredo,
            @Value("${security.jwt.expiration-ms}") long expiracaoMs
    ) {
        this.chave = criarChave(segredo);
        this.expiracaoMs = expiracaoMs;
    }

    // Gera o token no login, com email, id e papéis do usuário
    public String gerarToken(Integer usuarioId, String email, List<String> papeis) {
        Instant agora = Instant.now();

        return Jwts.builder()
                .subject(email)
                .claim("usuarioId", usuarioId)
                .claim("papeis", papeis)
                .issuedAt(Date.from(agora))
                .expiration(Date.from(agora.plusMillis(expiracaoMs)))
                .signWith(chave)
                .compact();
    }

    // Confere se o token é válido e devolve o que está guardado nele
    public Claims validar(String token) {
        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Converte o segredo do .env na chave usada pra assinar/validar
    private SecretKey criarChave(String segredo) {
        try {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(segredo));
        } catch (IllegalArgumentException | DecodingException exception) {
            return Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        }
    }
}