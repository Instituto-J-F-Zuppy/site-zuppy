package br.com.zuppy.site.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "pedido_historico_status")
public class PedidoHistoricoStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "status_tipo_id", nullable = false)
    private PedidoStatusTipo statusTipo;

    @Column(name = "data_alteracao", nullable = false, insertable = false, updatable = false)
    private LocalDateTime dataAlteracao;

    @Column(name = "observacao")
    private String observacao;

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public PedidoStatusTipo getStatusTipo() {
        return statusTipo;
    }

    public void setStatusTipo(PedidoStatusTipo statusTipo) {
        this.statusTipo = statusTipo;
    }

    public LocalDateTime getDataAlteracao() {
        return dataAlteracao;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
