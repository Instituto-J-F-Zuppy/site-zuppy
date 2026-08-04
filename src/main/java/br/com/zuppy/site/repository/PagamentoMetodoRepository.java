package br.com.zuppy.site.repository;

import br.com.zuppy.site.model.PagamentoMetodo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PagamentoMetodoRepository extends JpaRepository<PagamentoMetodo, Integer> {

    Optional<PagamentoMetodo> findByNome(String nome);
}
