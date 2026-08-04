package br.com.zuppy.site.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ItemPedidoRequest(
        @NotBlank String produtoId,
        @NotBlank String nomeProduto,
        @NotNull @DecimalMin(value = "0.01") BigDecimal preco,
        @NotNull @Min(1) Integer quantidade
) {
}
