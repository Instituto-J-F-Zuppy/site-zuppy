package br.com.zuppy.site.repository;

import br.com.zuppy.site.model.PedidoHistoricoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PedidoHistoricoStatusRepository extends JpaRepository<PedidoHistoricoStatus, Integer> {

    Optional<PedidoHistoricoStatus> findTopByPedido_IdOrderByDataAlteracaoDesc(Integer pedidoId);
}
