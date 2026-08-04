package br.com.zuppy.site.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

/**
 * Mapeamento minimo da tabela "brinquedos" (produtos). So os campos usados
 * ao validar/precificar um pedido -- a tabela tem outras colunas (marca_id,
 * sku, dimensoes etc.) que nao sao necessarias aqui.
 */
@Entity
@Table(name = "brinquedos")
public class Brinquedo {

    @Id
    private Integer id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "preco", nullable = false)
    private BigDecimal preco;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo;

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public Boolean getAtivo() {
        return ativo;
    }
}
