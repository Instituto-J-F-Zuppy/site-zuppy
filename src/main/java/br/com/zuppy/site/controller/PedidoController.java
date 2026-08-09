package br.com.zuppy.site.controller;

import br.com.zuppy.site.dto.CriarPedidoRequest;
import br.com.zuppy.site.dto.PedidoResponse;
import br.com.zuppy.site.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse criar(@Valid @RequestBody CriarPedidoRequest request, Authentication authentication) {
        return pedidoService.criarPedido(authentication.getName(), request);
    }

    @GetMapping
    public List<PedidoResponse> listar(Authentication authentication) {
        return pedidoService.listarPedidos(authentication.getName());
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Integer id, Authentication authentication) {
        return pedidoService.buscarPedido(authentication.getName(), id);
    }
}
