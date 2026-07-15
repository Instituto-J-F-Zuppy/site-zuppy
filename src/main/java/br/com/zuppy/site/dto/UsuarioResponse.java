package br.com.zuppy.site.dto;

import java.util.List;

public record UsuarioResponse(
        Integer id,
        String nome,
        String email,
        String cpfCnpj,
        Boolean ativo,
        List<String> papeis
) {
}
