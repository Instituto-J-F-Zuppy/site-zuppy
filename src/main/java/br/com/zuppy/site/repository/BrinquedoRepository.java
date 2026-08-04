package br.com.zuppy.site.repository;

import br.com.zuppy.site.model.Brinquedo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrinquedoRepository extends JpaRepository<Brinquedo, Integer> {
}
