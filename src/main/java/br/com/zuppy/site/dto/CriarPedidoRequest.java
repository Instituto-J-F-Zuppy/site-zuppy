package br.com.zuppy.site.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CriarPedidoRequest(
        @NotBlank String nomeCompleto,
        @NotBlank @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP invalido") String cep,
        @NotBlank String numero,
        @NotBlank String endereco,
        String complemento,
        @NotBlank String bairro,
        @NotBlank String cidade,
        @NotBlank @Size(min = 2, max = 2) String uf,
        @NotBlank @Pattern(regexp = "cartao|pix|boleto", message = "forma de pagamento invalida") String formaPagamento,
        @NotEmpty @Valid List<ItemPedidoRequest> itens
) {
}
