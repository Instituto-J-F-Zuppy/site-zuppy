package br.com.zuppy.site.service;

import br.com.zuppy.site.dto.CriarPedidoRequest;
import br.com.zuppy.site.dto.ItemPedidoRequest;
import br.com.zuppy.site.dto.ItemPedidoResponse;
import br.com.zuppy.site.dto.PedidoResponse;
import br.com.zuppy.site.model.ItemPedido;
import br.com.zuppy.site.model.Pedido;
import br.com.zuppy.site.model.Usuario;
import br.com.zuppy.site.repository.PedidoRepository;
import br.com.zuppy.site.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoService(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PedidoResponse criarPedido(String emailUsuario, CriarPedidoRequest request) {
        Usuario usuario = buscarUsuario(emailUsuario);

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setNomeCompleto(request.nomeCompleto().trim());
        pedido.setCep(request.cep().trim());
        pedido.setNumero(request.numero().trim());
        pedido.setEndereco(request.endereco().trim());
        pedido.setComplemento(request.complemento() == null ? null : request.complemento().trim());
        pedido.setBairro(request.bairro().trim());
        pedido.setCidade(request.cidade().trim());
        pedido.setUf(request.uf().trim().toUpperCase());
        pedido.setFormaPagamento(request.formaPagamento().trim().toLowerCase());

        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoRequest itemRequest : request.itens()) {
            ItemPedido item = new ItemPedido();
            item.setProdutoId(itemRequest.produtoId());
            item.setNomeProduto(itemRequest.nomeProduto());
            item.setPreco(itemRequest.preco());
            item.setQuantidade(itemRequest.quantidade());
            pedido.adicionarItem(item);

            total = total.add(itemRequest.preco().multiply(BigDecimal.valueOf(itemRequest.quantidade())));
        }

        pedido.setTotal(total);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        return montarResponse(pedidoSalvo);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPedidos(String emailUsuario) {
        Usuario usuario = buscarUsuario(emailUsuario);

        return pedidoRepository.findByUsuario_IdOrderByCriadoEmDesc(usuario.getId())
                .stream()
                .map(this::montarResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarPedido(String emailUsuario, Integer pedidoId) {
        Usuario usuario = buscarUsuario(emailUsuario);

        Pedido pedido = pedidoRepository.findByIdAndUsuario_Id(pedidoId, usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException("Pedido nao encontrado."));

        return montarResponse(pedido);
    }

    private Usuario buscarUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
    }

    private PedidoResponse montarResponse(Pedido pedido) {
        List<ItemPedidoResponse> itens = pedido.getItens().stream()
                .map(item -> new ItemPedidoResponse(
                        item.getProdutoId(),
                        item.getNomeProduto(),
                        item.getPreco(),
                        item.getQuantidade()
                ))
                .toList();

        return new PedidoResponse(
                pedido.getId(),
                "#ZP" + String.format("%06d", pedido.getId()),
                pedido.getStatus(),
                pedido.getFormaPagamento(),
                pedido.getTotal(),
                pedido.getCriadoEm(),
                pedido.getNomeCompleto(),
                pedido.getCep(),
                pedido.getNumero(),
                pedido.getEndereco(),
                pedido.getComplemento(),
                pedido.getBairro(),
                pedido.getCidade(),
                pedido.getUf(),
                itens
        );
    }
}
