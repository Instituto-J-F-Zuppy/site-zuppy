package br.com.zuppy.site.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> regraNegocio(IllegalArgumentException exception) {
        return erro(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> credenciaisInvalidas(BadCredentialsException exception) {
        return erro(HttpStatus.UNAUTHORIZED, exception.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> estadoInvalido(IllegalStateException exception) {
        return erro(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> conflitoBanco(DataIntegrityViolationException exception) {
        return erro(HttpStatus.CONFLICT, "Registro ja existe ou viola uma restricao do banco.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacao(MethodArgumentNotValidException exception) {
        String mensagem = exception.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fieldError -> fieldError.getDefaultMessage() == null ? "valor invalido" : fieldError.getDefaultMessage(),
                        (primeiro, ignorado) -> primeiro
                ))
                .entrySet()
                .stream()
                .map(entry -> entry.getKey() + ": " + entry.getValue())
                .collect(Collectors.joining("; "));

        return erro(HttpStatus.BAD_REQUEST, mensagem);
    }

    private ResponseEntity<Map<String, Object>> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of(
                "timestamp", Instant.now(),
                "status", status.value(),
                "erro", mensagem
        ));
    }
}
