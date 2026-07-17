package br.com.zuppy.site.service;

import br.com.zuppy.site.config.JwtService;
import br.com.zuppy.site.dto.AuthResponse;
import br.com.zuppy.site.dto.LoginRequest;
import br.com.zuppy.site.dto.RegisterRequest;
import br.com.zuppy.site.dto.UsuarioResponse;
import br.com.zuppy.site.model.Usuario;
import br.com.zuppy.site.repository.UsuarioRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    private static final String PAPEL_PADRAO = "CLIENTE";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UsuarioResponse cadastrar(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        String cpfCnpj = apenasNumeros(request.cpfCnpj());

        if (cpfCnpj.length() != 11 && cpfCnpj.length() != 14) {
            throw new IllegalArgumentException("CPF/CNPJ deve conter 11 ou 14 numeros.");
        }

        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email ja cadastrado.");
        }

        if (usuarioRepository.existsByCpfCnpj(cpfCnpj)) {
            throw new IllegalArgumentException("CPF/CNPJ ja cadastrado.");
        }

        Integer papelId = usuarioRepository.buscarPapelIdPorNome(PAPEL_PADRAO)
                .orElseThrow(() -> new IllegalStateException("Papel CLIENTE nao encontrado no banco."));

        Usuario usuario = new Usuario();
        usuario.setNome(request.nome().trim());
        usuario.setEmail(email);
        usuario.setCpfCnpj(cpfCnpj);
        usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        usuario.setAtivo(true);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        usuarioRepository.vincularPapel(usuarioSalvo.getId(), papelId);

        return montarUsuarioResponse(usuarioSalvo, List.of(PAPEL_PADRAO));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .filter(Usuario::getAtivo)
                .orElseThrow(() -> new BadCredentialsException("Email ou senha invalidos."));

        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new BadCredentialsException("Email ou senha invalidos.");
        }

        List<String> papeis = usuarioRepository.buscarPapeis(usuario.getId());
        String token = jwtService.gerarToken(usuario.getId(), usuario.getEmail(), papeis);
        return new AuthResponse(token, usuario.getNome());
    }

    private UsuarioResponse montarUsuarioResponse(Usuario usuario, List<String> papeis) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getCpfCnpj(),
                usuario.getAtivo(),
                papeis
        );
    }

    private String apenasNumeros(String valor) {
        return valor == null ? "" : valor.replaceAll("\\D", "");
    }
}