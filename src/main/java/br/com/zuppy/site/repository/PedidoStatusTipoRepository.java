package br.com.zuppy.site.repository;

import br.com.zuppy.site.model.PedidoStatusTipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PedidoStatusTipoRepository extends JpaRepository<PedidoStatusTipo, Integer> {

    Optional<PedidoStatusTipo> findByNome(String nome);
}
