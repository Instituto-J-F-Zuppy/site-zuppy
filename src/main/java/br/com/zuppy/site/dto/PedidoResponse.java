package br.com.zuppy.site.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Integer id,
        String numero,
        String status,
        String formaPagamento,
        BigDecimal valorTotal,
        BigDecimal valorFrete,
        LocalDateTime criadoEm,
        String cep,
        String numeroEndereco,
        String endereco,
        String complemento,
        String bairro,
        String cidade,
        String uf,
        List<ItemPedidoResponse> itens
) {
}
