const produtosRelacionadosPipo = {
    "Boneco de Pelúcia Pipo": {
        id: "boneco-de-pelucia-pipo",
        nome: "Boneco de Pelúcia Pipo",
        preco: 70,
        imagem: "img/produto_pelucia_pip.png"
    },

    "Boneco Funko Pop Pipo": {
        id: "boneco-funko-pop-pipo",
        nome: "Boneco Funko Pop Pipo",
        preco: 210,
        imagem: "img/produto_funko_pipo.png"
    },

    "Fronha Capa Travesseiro Pipo": {
        id: "fronha-capa-travesseiro-pipo",
        nome: "Fronha Capa Travesseiro Pipo",
        preco: 15,
        imagem: "img/produto_fronha_pipo.png"
    }
};

const cartoesProdutosRelacionados =
    document.querySelectorAll(
        ".card-produto-relacionado"
    );

const mensagemProdutoAdicionado =
    document.getElementById(
        "mensagemProdutoAdicionado"
    );

function obterChaveFavoritosPipo() {
    if (
        !window.ControleConta
    ) {
        return null;
    }

    const identificador =
        window.ControleConta
            .obterIdentificadorUsuario();

    if (!identificador) {
        return null;
    }

    return `zuppyFavoritos:${identificador}`;
}

function lerFavoritosPipo() {
    const chave =
        obterChaveFavoritosPipo();

    if (!chave) {
        return [];
    }

    try {
        const dados =
            localStorage.getItem(chave);

        const favoritos =
            dados
                ? JSON.parse(dados)
                : [];

        return Array.isArray(
            favoritos
        )
            ? favoritos
            : [];
    } catch {
        return [];
    }
}

function salvarFavoritosPipo(
    favoritos
) {
    const chave =
        obterChaveFavoritosPipo();

    if (!chave) {
        return false;
    }

    localStorage.setItem(
        chave,
        JSON.stringify(
            [...new Set(favoritos)]
        )
    );

    window.dispatchEvent(
        new CustomEvent(
            "favoritos-atualizados"
        )
    );

    return true;
}

function estaFavoritadoPipo(
    idProduto
) {
    return lerFavoritosPipo()
        .includes(idProduto);
}

function alternarFavoritoPipo(
    idProduto
) {
    if (
        !window.ControleConta ||
        !window.ControleConta.exigirConta(
            "favoritos"
        )
    ) {
        return null;
    }

    const favoritos =
        lerFavoritosPipo();

    const indice =
        favoritos.indexOf(
            idProduto
        );

    if (indice === -1) {
        favoritos.push(
            idProduto
        );

        salvarFavoritosPipo(
            favoritos
        );

        return true;
    }

    favoritos.splice(
        indice,
        1
    );

    salvarFavoritosPipo(
        favoritos
    );

    return false;
}

function atualizarBotaoFavoritoPipo(
    botao,
    produto,
    favoritado
) {
    botao.classList.toggle(
        "favoritado",
        favoritado
    );

    botao.textContent =
        favoritado
            ? "♥"
            : "♡";

    botao.setAttribute(
        "aria-pressed",
        String(favoritado)
    );

    botao.setAttribute(
        "aria-label",
        favoritado
            ? `Remover ${produto.nome} dos favoritos`
            : `Adicionar ${produto.nome} aos favoritos`
    );
}

cartoesProdutosRelacionados.forEach(
    function (cartao) {
        const titulo =
            cartao.querySelector("h3");

        if (!titulo) {
            return;
        }

        const nomeProduto =
            titulo.textContent.trim();

        const produto =
            produtosRelacionadosPipo[
                nomeProduto
            ];

        if (!produto) {
            return;
        }

        const botaoFavorito =
            cartao.querySelector(
                ".favorito-produto-relacionado"
            );

        const botaoAdicionar =
            cartao.querySelector(
                ".adicionar-produto-relacionado"
            );

        const linkProduto =
            cartao.querySelector(
                ".link-produto-relacionado"
            );

        if (linkProduto) {
            linkProduto.href =
                `produto.html?id=${encodeURIComponent(
                    produto.id
                )}`;
        }

        if (botaoFavorito) {
            atualizarBotaoFavoritoPipo(
                botaoFavorito,
                produto,
                estaFavoritadoPipo(
                    produto.id
                )
            );

            botaoFavorito.addEventListener(
                "click",
                function () {
                    const favoritado =
                        alternarFavoritoPipo(
                            produto.id
                        );

                    if (
                        favoritado === null
                    ) {
                        return;
                    }

                    atualizarBotaoFavoritoPipo(
                        botaoFavorito,
                        produto,
                        favoritado
                    );
                }
            );
        }

        if (botaoAdicionar) {
            botaoAdicionar.addEventListener(
                "click",
                function () {
                    const adicionado =
                        CarrinhoStore.adicionar({
                            id: produto.id,
                            nome: produto.nome,
                            preco: produto.preco,
                            imagem: produto.imagem
                        });

                    if (!adicionado) {
                        return;
                    }

                    const textoBotao =
                        botaoAdicionar
                            .querySelector(
                                "span"
                            );

                    if (!textoBotao) {
                        return;
                    }

                    const textoOriginal =
                        textoBotao.textContent;

                    textoBotao.textContent =
                        "Produto adicionado";

                    botaoAdicionar
                        .classList
                        .add(
                            "produto-adicionado"
                        );

                    botaoAdicionar.disabled =
                        true;

                    if (
                        mensagemProdutoAdicionado
                    ) {
                        mensagemProdutoAdicionado
                            .textContent =
                            `${produto.nome} foi adicionado ao carrinho.`;
                    }

                    window.setTimeout(
                        function () {
                            textoBotao.textContent =
                                textoOriginal;

                            botaoAdicionar
                                .classList
                                .remove(
                                    "produto-adicionado"
                                );

                            botaoAdicionar.disabled =
                                false;

                            if (
                                mensagemProdutoAdicionado
                            ) {
                                mensagemProdutoAdicionado
                                    .textContent =
                                    "";
                            }
                        },
                        2200
                    );
                }
            );
        }
    }
);