package br.com.zuppy.site.dto;

import java.math.BigDecimal;

public record ItemPedidoResponse(
        Integer brinquedoId,
        String nomeBrinquedo,
        BigDecimal precoUnitario,
        Integer quantidade,
        BigDecimal subtotal
) {
}
