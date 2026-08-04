package br.com.zuppy.site.repository;

import br.com.zuppy.site.model.Cidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CidadeRepository extends JpaRepository<Cidade, Integer> {

    Optional<Cidade> findByNomeIgnoreCaseAndEstado_Id(String nome, Integer estadoId);
}
