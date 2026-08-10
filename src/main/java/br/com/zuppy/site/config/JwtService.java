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

@Service
public class JwtService {

    private final SecretKey chave;
    private final long expiracaoMs;

    public JwtService(
            @Value("${security.jwt.secret}") String segredo,
            @Value("${security.jwt.expiration-ms}") long expiracaoMs
    ) {
        this.chave = criarChave(segredo);
        this.expiracaoMs = expiracaoMs;
    }

    //gera o token
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

    //valida o token
    public Claims validar(String token) {
        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    //cria a chave 
    private SecretKey criarChave(String segredo) {
        try {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(segredo));
        } catch (IllegalArgumentException | DecodingException exception) {
            return Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
        }
    }
}
