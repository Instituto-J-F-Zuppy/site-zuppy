package br.com.zuppy.site.repository;

import br.com.zuppy.site.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    List<Pedido> findByUsuario_IdOrderByCriadoEmDesc(Integer usuarioId);

    Optional<Pedido> findByIdAndUsuario_Id(Integer id, Integer usuarioId);
}
