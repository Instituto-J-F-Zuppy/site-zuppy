package br.com.zuppy.site.repository;

import br.com.zuppy.site.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByCpfCnpj(String cpfCnpj);

    @Query(value = """
            select p.nome
            from usuario_papel up
            join papeis p on p.id = up.papel_id
            where up.usuario_id = :usuarioId
            """, nativeQuery = true)
    List<String> buscarPapeis(@Param("usuarioId") Integer usuarioId);

    @Query(value = "select id from papeis where nome = :nome", nativeQuery = true)
    Optional<Integer> buscarPapelIdPorNome(@Param("nome") String nome);

    @Modifying
    @Query(value = """
            insert into usuario_papel (usuario_id, papel_id)
            values (:usuarioId, :papelId)
            on conflict (usuario_id, papel_id) do nothing
            """, nativeQuery = true)
    void vincularPapel(@Param("usuarioId") Integer usuarioId, @Param("papelId") Integer papelId);
}
