package br.com.zuppy.site.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemPedidoRequest(
        @NotNull Integer brinquedoId,
        @NotNull @Min(1) Integer quantidade
) {
}
