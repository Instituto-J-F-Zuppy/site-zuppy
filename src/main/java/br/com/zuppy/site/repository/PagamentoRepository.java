package br.com.zuppy.site.repository;

import br.com.zuppy.site.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PagamentoRepository extends JpaRepository<Pagamento, Integer> {

    Optional<Pagamento> findTopByPedido_IdOrderByCriadoEmDesc(Integer pedidoId);
}
