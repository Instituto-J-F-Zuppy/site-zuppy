package br.com.zuppy.site.service;

import br.com.zuppy.site.dto.CriarPedidoRequest;
import br.com.zuppy.site.dto.ItemPedidoRequest;
import br.com.zuppy.site.dto.ItemPedidoResponse;
import br.com.zuppy.site.dto.PedidoResponse;
import br.com.zuppy.site.model.Brinquedo;
import br.com.zuppy.site.model.Cidade;
import br.com.zuppy.site.model.Endereco;
import br.com.zuppy.site.model.Estado;
import br.com.zuppy.site.model.ItemPedido;
import br.com.zuppy.site.model.Pagamento;
import br.com.zuppy.site.model.PagamentoMetodo;
import br.com.zuppy.site.model.Pedido;
import br.com.zuppy.site.model.PedidoHistoricoStatus;
import br.com.zuppy.site.model.PedidoStatusTipo;
import br.com.zuppy.site.model.Usuario;
import br.com.zuppy.site.repository.BrinquedoRepository;
import br.com.zuppy.site.repository.CidadeRepository;
import br.com.zuppy.site.repository.EnderecoRepository;
import br.com.zuppy.site.repository.EstadoRepository;
import br.com.zuppy.site.repository.PagamentoMetodoRepository;
import br.com.zuppy.site.repository.PagamentoRepository;
import br.com.zuppy.site.repository.PedidoHistoricoStatusRepository;
import br.com.zuppy.site.repository.PedidoRepository;
import br.com.zuppy.site.repository.PedidoStatusTipoRepository;
import br.com.zuppy.site.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PedidoService {

    private static final Map<String, String> METODOS_PAGAMENTO = Map.of(
            "cartao", "CARTAO_CREDITO",
            "pix", "PIX",
            "boleto", "BOLETO"
    );

    private static final String STATUS_INICIAL = "PAGO";

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstadoRepository estadoRepository;
    private final CidadeRepository cidadeRepository;
    private final EnderecoRepository enderecoRepository;
    private final BrinquedoRepository brinquedoRepository;
    private final PagamentoMetodoRepository pagamentoMetodoRepository;
    private final PagamentoRepository pagamentoRepository;
    private final PedidoStatusTipoRepository pedidoStatusTipoRepository;
    private final PedidoHistoricoStatusRepository pedidoHistoricoStatusRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            UsuarioRepository usuarioRepository,
            EstadoRepository estadoRepository,
            CidadeRepository cidadeRepository,
            EnderecoRepository enderecoRepository,
            BrinquedoRepository brinquedoRepository,
            PagamentoMetodoRepository pagamentoMetodoRepository,
            PagamentoRepository pagamentoRepository,
            PedidoStatusTipoRepository pedidoStatusTipoRepository,
            PedidoHistoricoStatusRepository pedidoHistoricoStatusRepository
    ) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.estadoRepository = estadoRepository;
        this.cidadeRepository = cidadeRepository;
        this.enderecoRepository = enderecoRepository;
        this.brinquedoRepository = brinquedoRepository;
        this.pagamentoMetodoRepository = pagamentoMetodoRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.pedidoStatusTipoRepository = pedidoStatusTipoRepository;
        this.pedidoHistoricoStatusRepository = pedidoHistoricoStatusRepository;
    }

    @Transactional
    public PedidoResponse criarPedido(String emailUsuario, CriarPedidoRequest request) {
        Usuario usuario = buscarUsuario(emailUsuario);

        Estado estado = estadoRepository.findBySiglaIgnoreCase(request.uf().trim())
                .orElseThrow(() -> new IllegalArgumentException("UF nao encontrada: " + request.uf()));

        Cidade cidade = cidadeRepository.findByNomeIgnoreCaseAndEstado_Id(request.cidade().trim(), estado.getId())
                .orElseGet(() -> {
                    Cidade novaCidade = new Cidade();
                    novaCidade.setEstado(estado);
                    novaCidade.setNome(request.cidade().trim());
                    return cidadeRepository.save(novaCidade);
                });

        Endereco endereco = new Endereco();
        endereco.setUsuario(usuario);
        endereco.setCidade(cidade);
        endereco.setLogradouro(request.endereco().trim());
        endereco.setNumero(request.numero().trim());
        endereco.setComplemento(vazioParaNulo(request.complemento()));
        endereco.setBairro(request.bairro().trim());
        endereco.setCep(request.cep().trim());
        endereco.setTipoEndereco("ENTREGA");
        endereco.setPrincipal(false);
        Endereco enderecoSalvo = enderecoRepository.save(endereco);

        String nomeMetodo = METODOS_PAGAMENTO.get(request.formaPagamento().trim().toLowerCase());
        PagamentoMetodo metodo = pagamentoMetodoRepository.findByNome(nomeMetodo)
                .orElseThrow(() -> new IllegalStateException("Metodo de pagamento nao cadastrado: " + nomeMetodo));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setEnderecoEntrega(enderecoSalvo);
        pedido.setEnderecoFaturamento(enderecoSalvo);
        pedido.setValorFrete(BigDecimal.ZERO);

        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedidoRequest itemRequest : request.itens()) {
            Brinquedo brinquedo = brinquedoRepository.findById(itemRequest.brinquedoId())
                    .filter(Brinquedo::getAtivo)
                    .orElseThrow(() -> new IllegalArgumentException("Produto nao encontrado ou indisponivel: " + itemRequest.brinquedoId()));

            BigDecimal subtotal = brinquedo.getPreco().multiply(BigDecimal.valueOf(itemRequest.quantidade()));

            ItemPedido item = new ItemPedido();
            item.setBrinquedo(brinquedo);
            item.setQuantidade(itemRequest.quantidade());
            item.setPrecoUnitario(brinquedo.getPreco());
            item.setSubtotal(subtotal);
            pedido.adicionarItem(item);

            total = total.add(subtotal);
        }

        pedido.setValorTotal(total);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        PedidoStatusTipo statusInicial = pedidoStatusTipoRepository.findByNome(STATUS_INICIAL)
                .orElseThrow(() -> new IllegalStateException("Status de pedido nao cadastrado: " + STATUS_INICIAL));

        PedidoHistoricoStatus historico = new PedidoHistoricoStatus();
        historico.setPedido(pedidoSalvo);
        historico.setStatusTipo(statusInicial);
        historico.setObservacao("Pagamento simulado aprovado automaticamente (sem gateway real).");
        pedidoHistoricoStatusRepository.save(historico);

        Pagamento pagamento = new Pagamento();
        pagamento.setPedido(pedidoSalvo);
        pagamento.setMetodo(metodo);
        pagamento.setStatus("APROVADO");
        pagamento.setValor(total);
        pagamento.setTransacaoId("SIM-" + UUID.randomUUID());
        pagamento.setDataPagamento(LocalDateTime.now());
        pagamentoRepository.save(pagamento);

        return montarResponse(pedidoSalvo, statusInicial.getNome(), nomeMetodo);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPedidos(String emailUsuario) {
        Usuario usuario = buscarUsuario(emailUsuario);

        return pedidoRepository.findByUsuario_IdOrderByCriadoEmDesc(usuario.getId())
                .stream()
                .map(this::montarResponseComConsulta)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscarPedido(String emailUsuario, Integer pedidoId) {
        Usuario usuario = buscarUsuario(emailUsuario);

        Pedido pedido = pedidoRepository.findByIdAndUsuario_Id(pedidoId, usuario.getId())
                .orElseThrow(() -> new IllegalArgumentException("Pedido nao encontrado."));

        return montarResponseComConsulta(pedido);
    }

    private Usuario buscarUsuario(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario nao encontrado."));
    }

    private String vazioParaNulo(String valor) {
        return (valor == null || valor.isBlank()) ? null : valor.trim();
    }

    private PedidoResponse montarResponseComConsulta(Pedido pedido) {
        String status = pedidoHistoricoStatusRepository.findTopByPedido_IdOrderByDataAlteracaoDesc(pedido.getId())
                .map(historico -> historico.getStatusTipo().getNome())
                .orElse("DESCONHECIDO");

        String formaPagamento = pagamentoRepository.findTopByPedido_IdOrderByCriadoEmDesc(pedido.getId())
                .map(pagamento -> pagamento.getMetodo().getNome())
                .orElse("DESCONHECIDO");

        return montarResponse(pedido, status, formaPagamento);
    }

    private PedidoResponse montarResponse(Pedido pedido, String status, String formaPagamento) {
        List<ItemPedidoResponse> itens = pedido.getItens().stream()
                .map(item -> new ItemPedidoResponse(
                        item.getBrinquedo().getId(),
                        item.getBrinquedo().getNome(),
                        item.getPrecoUnitario(),
                        item.getQuantidade(),
                        item.getSubtotal()
                ))
                .toList();

        Endereco endereco = pedido.getEnderecoEntrega();

        return new PedidoResponse(
                pedido.getId(),
                "#ZP" + String.format("%06d", pedido.getId()),
                status,
                formaPagamento,
                pedido.getValorTotal(),
                pedido.getValorFrete(),
                pedido.getCriadoEm(),
                endereco.getCep(),
                endereco.getNumero(),
                endereco.getLogradouro(),
                endereco.getComplemento(),
                endereco.getBairro(),
                endereco.getCidade().getNome(),
                endereco.getCidade().getEstado().getSigla(),
                itens
        );
    }
}
