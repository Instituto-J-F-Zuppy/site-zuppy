package br.com.zuppy.site.dto;

import java.math.BigDecimal;

public record ItemPedidoResponse(
        String produtoId,
        String nomeProduto,
        BigDecimal preco,
        Integer quantidade
) {
}
