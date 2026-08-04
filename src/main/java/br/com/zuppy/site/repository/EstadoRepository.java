package br.com.zuppy.site.repository;

import br.com.zuppy.site.model.Estado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoRepository extends JpaRepository<Estado, Integer> {

    Optional<Estado> findBySiglaIgnoreCase(String sigla);
}
