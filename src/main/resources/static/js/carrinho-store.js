const CHAVE_CARRINHO_ANTIGA = "zuppyCarrinho";

function decodificarTokenUsuario(token) {
    try {
        const partes = token.split(".");

        if (partes.length !== 3) {
            return null;
        }

        let conteudo = partes[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const quantidadePreenchimento =
            (4 - conteudo.length % 4) % 4;

        conteudo += "=".repeat(quantidadePreenchimento);

        const textoBinario = atob(conteudo);

        const bytes = Uint8Array.from(
            textoBinario,
            function (caractere) {
                return caractere.charCodeAt(0);
            }
        );

        const texto = new TextDecoder().decode(bytes);

        return JSON.parse(texto);
    } catch {
        return null;
    }
}

function obterDadosUsuarioLogado() {
    const token = localStorage.getItem("zuppyToken");
    const nome = localStorage.getItem("zuppyNome");

    if (!token || !nome) {
        return null;
    }

    const dadosToken = decodificarTokenUsuario(token);

    if (!dadosToken) {
        localStorage.removeItem("zuppyToken");
        localStorage.removeItem("zuppyNome");
        return null;
    }

    if (
        dadosToken.exp &&
        dadosToken.exp * 1000 <= Date.now()
    ) {
        localStorage.removeItem("zuppyToken");
        localStorage.removeItem("zuppyNome");
        return null;
    }

    return {
        token: token,
        nome: nome,
        usuarioId: dadosToken.usuarioId || null,
        email: dadosToken.sub || null
    };
}

function obterIdentificadorUsuario() {
    const usuario = obterDadosUsuarioLogado();

    if (!usuario) {
        return null;
    }

    if (usuario.usuarioId !== null) {
        return `usuario-${usuario.usuarioId}`;
    }

    if (usuario.email) {
        return `usuario-${usuario.email.toLowerCase()}`;
    }

    return null;
}

function criarEstilosModalConta() {
    if (
        document.getElementById(
            "estilosModalConta"
        )
    ) {
        return;
    }

    const estilos = document.createElement("style");

    estilos.id = "estilosModalConta";

    estilos.textContent = `
        body.modal-conta-aberto {
            overflow: hidden;
        }

        .modal-conta-fundo {
            position: fixed;
            inset: 0;
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background-color: rgba(0, 0, 0, 0.56);
            backdrop-filter: blur(3px);
        }

        .modal-conta {
            width: 100%;
            max-width: 430px;
            padding: 38px 34px 32px;
            border-radius: 24px;
            background-color: #ffffff;
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
            font-family: 'Nunito', Arial, sans-serif;
            text-align: center;
        }

        .modal-conta h2 {
            margin: 0 0 14px;
            color: #171717;
            font-family: 'Fredoka', 'Nunito', Arial, sans-serif;
            font-size: 28px;
            font-weight: 700;
            line-height: 1.2;
        }

        .modal-conta p {
            margin: 0;
            color: #454545;
            font-size: 16px;
            font-weight: 500;
            line-height: 1.6;
        }

        .modal-conta-texto-secundario {
            margin-top: 12px !important;
            color: #707070 !important;
            font-size: 14px !important;
            font-weight: 400 !important;
            line-height: 1.55 !important;
        }

        .modal-conta-acoes {
            margin-top: 28px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .modal-conta-login {
            width: 100%;
            min-height: 50px;
            padding: 12px 20px;
            border: 2px solid #7c46ff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #7c46ff;
            color: #ffffff;
            font-size: 16px;
            font-weight: 800;
            text-decoration: none;
            transition:
                transform 0.2s ease,
                filter 0.2s ease;
        }

        .modal-conta-login:hover {
            transform: translateY(-2px);
            filter: brightness(0.93);
        }

        .modal-conta-cancelar {
            width: 100%;
            min-height: 48px;
            padding: 10px 20px;
            border: 2px solid #dddddd;
            border-radius: 12px;
            background-color: #ffffff;
            color: #333333;
            font-family: 'Nunito', Arial, sans-serif;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition:
                background-color 0.2s ease,
                border-color 0.2s ease;
        }

        .modal-conta-cancelar:hover {
            background-color: #f5f5f5;
            border-color: #cccccc;
        }

        .modal-conta-login:focus-visible,
        .modal-conta-cancelar:focus-visible {
            outline: 3px solid #38bdf8;
            outline-offset: 3px;
        }

        html[data-contraste-acessivel="true"] .modal-conta {
            background-color: #000000 !important;
            border: 2px solid #ffffff !important;
        }

        html[data-contraste-acessivel="true"] .modal-conta h2,
        html[data-contraste-acessivel="true"] .modal-conta p {
            color: #ffffff !important;
        }

        html[data-contraste-acessivel="true"] .modal-conta-login,
        html[data-contraste-acessivel="true"] .modal-conta-cancelar {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 2px solid #ffffff !important;
        }

        @media (max-width: 520px) {
            .modal-conta-fundo {
                padding: 16px;
            }

            .modal-conta {
                padding: 32px 22px 24px;
                border-radius: 19px;
            }

            .modal-conta h2 {
                font-size: 24px;
            }

            .modal-conta p {
                font-size: 15px;
            }
        }
    `;

    document.head.appendChild(estilos);
}

let elementoFocadoAntesModal = null;

function obterPaginaAtualParaRetorno() {
    const caminho =
        window.location.pathname
            .split("/")
            .filter(Boolean)
            .pop() || "index.html";

    return (
        caminho +
        window.location.search +
        window.location.hash
    );
}

function fecharModalConta() {
    const modal =
        document.getElementById(
            "modalContaObrigatoria"
        );

    if (!modal) {
        return;
    }

    modal.remove();

    document.body.classList.remove(
        "modal-conta-aberto"
    );

    if (
        elementoFocadoAntesModal &&
        typeof elementoFocadoAntesModal.focus ===
            "function"
    ) {
        elementoFocadoAntesModal.focus();
    }

    elementoFocadoAntesModal = null;
}

function abrirModalConta() {
    if (
        document.getElementById(
            "modalContaObrigatoria"
        )
    ) {
        return;
    }

    criarEstilosModalConta();

    elementoFocadoAntesModal =
        document.activeElement;

    const fundo =
        document.createElement("div");

    fundo.id = "modalContaObrigatoria";
    fundo.className = "modal-conta-fundo";

    const modal =
        document.createElement("div");

    modal.className = "modal-conta";

    modal.setAttribute(
        "role",
        "dialog"
    );

    modal.setAttribute(
        "aria-modal",
        "true"
    );

    modal.setAttribute(
        "aria-labelledby",
        "tituloModalConta"
    );

    modal.setAttribute(
        "aria-describedby",
        "mensagemModalConta"
    );

    const titulo =
        document.createElement("h2");

    titulo.id = "tituloModalConta";

    titulo.textContent =
        "Entre para continuar";

    const mensagem =
        document.createElement("p");

    mensagem.id = "mensagemModalConta";

    mensagem.textContent =
        "Para realizar essa ação, você precisa estar vinculado a uma conta.";

    const textoSecundario =
        document.createElement("p");

    textoSecundario.className =
        "modal-conta-texto-secundario";

    textoSecundario.textContent =
        "Assim, suas escolhas continuarão salvas e disponíveis sempre que você entrar.";

    const acoes =
        document.createElement("div");

    acoes.className =
        "modal-conta-acoes";

    const linkLogin =
        document.createElement("a");

    const retorno =
        obterPaginaAtualParaRetorno();

    linkLogin.className =
        "modal-conta-login";

    linkLogin.href =
        `login.html?retorno=${encodeURIComponent(
            retorno
        )}`;

    linkLogin.textContent =
        "Fazer login";

    const botaoCancelar =
        document.createElement("button");

    botaoCancelar.type = "button";

    botaoCancelar.className =
        "modal-conta-cancelar";

    botaoCancelar.textContent =
        "Agora não";

    acoes.appendChild(linkLogin);
    acoes.appendChild(botaoCancelar);

    modal.appendChild(titulo);
    modal.appendChild(mensagem);
    modal.appendChild(textoSecundario);
    modal.appendChild(acoes);

    fundo.appendChild(modal);

    document.body.appendChild(fundo);

    document.body.classList.add(
        "modal-conta-aberto"
    );

    botaoCancelar.addEventListener(
        "click",
        fecharModalConta
    );

    fundo.addEventListener(
        "click",
        function (evento) {
            if (
                evento.target === fundo
            ) {
                fecharModalConta();
            }
        }
    );

    modal.addEventListener(
        "keydown",
        function (evento) {
            if (
                evento.key === "Escape"
            ) {
                fecharModalConta();
                return;
            }

            if (
                evento.key !== "Tab"
            ) {
                return;
            }

            const elementosFocaveis =
                Array.from(
                    modal.querySelectorAll(
                        "a[href], button:not([disabled])"
                    )
                );

            if (
                elementosFocaveis.length === 0
            ) {
                return;
            }

            const primeiro =
                elementosFocaveis[0];

            const ultimo =
                elementosFocaveis[
                    elementosFocaveis.length - 1
                ];

            if (
                evento.shiftKey &&
                document.activeElement ===
                    primeiro
            ) {
                evento.preventDefault();
                ultimo.focus();
            } else if (
                !evento.shiftKey &&
                document.activeElement ===
                    ultimo
            ) {
                evento.preventDefault();
                primeiro.focus();
            }
        }
    );

    window.setTimeout(
        function () {
            linkLogin.focus();
        },
        0
    );
}

window.ControleConta = {
    estaLogado: function () {
        return Boolean(
            obterDadosUsuarioLogado()
        );
    },

    obterUsuario: function () {
        return obterDadosUsuarioLogado();
    },

    obterIdentificadorUsuario:
        function () {
            return obterIdentificadorUsuario();
        },

    exigirConta: function () {
        if (
            obterDadosUsuarioLogado()
        ) {
            return true;
        }

        abrirModalConta();

        return false;
    },

    abrirModal: function () {
        abrirModalConta();
    },

    fecharModal: function () {
        fecharModalConta();
    }
};

function identificarAcaoProtegida(
    elemento
) {
    if (
        elemento.closest(
            ".favorito-btn, .favorito-listagem, #botaoFavorito, .favorito-produto-relacionado"
        )
    ) {
        return "favoritos";
    }

    if (
        elemento.closest(
            ".btn-carrinho, .adicionar-listagem, #adicionarCarrinho, #comprarAgora, .adicionar-produto-relacionado"
        )
    ) {
        return "carrinho";
    }

    return null;
}

document.addEventListener(
    "click",
    function (evento) {
        if (
            window.ControleConta.estaLogado()
        ) {
            return;
        }

        if (
            !(
                evento.target instanceof
                Element
            )
        ) {
            return;
        }

        const acao =
            identificarAcaoProtegida(
                evento.target
            );

        if (!acao) {
            return;
        }

        evento.preventDefault();
        evento.stopPropagation();
        evento.stopImmediatePropagation();

        abrirModalConta();
    },
    true
);

const CHAVE_BASE_CARRINHO =
    "zuppyCarrinho";

function obterChaveCarrinho() {
    const identificador =
        window.ControleConta
            .obterIdentificadorUsuario();

    if (!identificador) {
        return null;
    }

    return `${CHAVE_BASE_CARRINHO}:${identificador}`;
}

function migrarCarrinhoAntigo(
    chaveAtual
) {
    if (
        localStorage.getItem(
            chaveAtual
        ) !== null
    ) {
        return;
    }

    const dadosAntigos =
        localStorage.getItem(
            CHAVE_CARRINHO_ANTIGA
        );

    if (!dadosAntigos) {
        return;
    }

    localStorage.setItem(
        chaveAtual,
        dadosAntigos
    );

    localStorage.removeItem(
        CHAVE_CARRINHO_ANTIGA
    );
}

function lerCarrinho() {
    const chave =
        obterChaveCarrinho();

    if (!chave) {
        return [];
    }

    migrarCarrinhoAntigo(
        chave
    );

    try {
        const dados =
            localStorage.getItem(
                chave
            );

        const itens =
            dados
                ? JSON.parse(dados)
                : [];

        return Array.isArray(
            itens
        )
            ? itens
            : [];
    } catch {
        return [];
    }
}

function salvarCarrinho(
    itens
) {
    const chave =
        obterChaveCarrinho();

    if (!chave) {
        return false;
    }

    localStorage.setItem(
        chave,
        JSON.stringify(itens)
    );

    window.dispatchEvent(
        new CustomEvent(
            "carrinho-atualizado"
        )
    );

    return true;
}

const CarrinhoStore = {
    listar: function () {
        return lerCarrinho();
    },

    adicionar: function (produto) {
        if (
            !window.ControleConta
                .exigirConta()
        ) {
            return false;
        }

        const itens =
            lerCarrinho();

        const existente =
            itens.find(
                function (item) {
                    return (
                        item.id ===
                        produto.id
                    );
                }
            );

        if (existente) {
            existente.quantidade += 1;
        } else {
            itens.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: 1
            });
        }

        salvarCarrinho(itens);

        return true;
    },

    remover: function (id) {
        if (
            !window.ControleConta
                .exigirConta()
        ) {
            return false;
        }

        const itens =
            lerCarrinho().filter(
                function (item) {
                    return (
                        item.id !== id
                    );
                }
            );

        salvarCarrinho(itens);

        return true;
    },

    aumentar: function (id) {
        if (
            !window.ControleConta
                .exigirConta()
        ) {
            return false;
        }

        const itens =
            lerCarrinho();

        const item =
            itens.find(
                function (
                    itemCarrinho
                ) {
                    return (
                        itemCarrinho.id ===
                        id
                    );
                }
            );

        if (!item) {
            return false;
        }

        item.quantidade += 1;

        salvarCarrinho(itens);

        return true;
    },

    diminuir: function (id) {
        if (
            !window.ControleConta
                .exigirConta()
        ) {
            return false;
        }

        const itens =
            lerCarrinho();

        const item =
            itens.find(
                function (
                    itemCarrinho
                ) {
                    return (
                        itemCarrinho.id ===
                        id
                    );
                }
            );

        if (!item) {
            return false;
        }

        if (
            item.quantidade > 1
        ) {
            item.quantidade -= 1;

            salvarCarrinho(itens);
        } else {
            const itensAtualizados =
                itens.filter(
                    function (
                        itemCarrinho
                    ) {
                        return (
                            itemCarrinho.id !==
                            id
                        );
                    }
                );

            salvarCarrinho(
                itensAtualizados
            );
        }

        return true;
    },

    limpar: function () {
        if (
            !window.ControleConta
                .exigirConta()
        ) {
            return false;
        }

        salvarCarrinho([]);

        return true;
    },

    contarProdutos: function () {
        return lerCarrinho().reduce(
            function (
                total,
                item
            ) {
                return (
                    total +
                    item.quantidade
                );
            },
            0
        );
    }
};

function atualizarBadgeCarrinho() {
    const badge =
        document.querySelector(
            ".carrinho-badge"
        );

    if (!badge) {
        return;
    }

    const quantidade =
        CarrinhoStore
            .contarProdutos();

    badge.textContent =
        quantidade > 0
            ? String(quantidade)
            : "";
}

atualizarBadgeCarrinho();

window.addEventListener(
    "carrinho-atualizado",
    atualizarBadgeCarrinho
);