const armazenamentoFavoritosPaginaInicial = FavoritosStore;
const armazenamentoCarrinhoPaginaInicial = CarrinhoStore;

function formatarPrecoInicio(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function extrairPercentualDesconto(descontoTexto) {
    const numero = parseInt(descontoTexto, 10);
    return Number.isNaN(numero) ? 0 : numero;
}

function criarCartaoProdutoInicio(produto) {
    const cartao = document.createElement("div");
    cartao.className = "produto-card";
    cartao.dataset.id = produto.id;

    const botaoFavorito = document.createElement("button");
    botaoFavorito.type = "button";
    botaoFavorito.className = "favorito-btn";
    botaoFavorito.setAttribute("aria-pressed", "false");
    botaoFavorito.setAttribute("aria-label", `Adicionar ${produto.nome} aos favoritos`);
    botaoFavorito.textContent = "♡";
    cartao.appendChild(botaoFavorito);

    const linkProduto = document.createElement("a");
    linkProduto.className = "produto-card-link";
    linkProduto.href = `produto.html?id=${encodeURIComponent(produto.id)}`;

    const areaImagem = document.createElement("div");
    areaImagem.className = "produto-img-area";

    const imagemProduto = document.createElement("img");
    imagemProduto.src = produto.imagem;
    imagemProduto.alt = produto.alt || produto.nome;
    imagemProduto.loading = "lazy";

    areaImagem.appendChild(imagemProduto);
    linkProduto.appendChild(areaImagem);

    const etiqueta = document.createElement("span");
    etiqueta.className = "produto-tag";
    etiqueta.textContent = "Só no Zuppy!";
    linkProduto.appendChild(etiqueta);

    const titulo = document.createElement("h3");
    titulo.textContent = produto.nome;
    linkProduto.appendChild(titulo);

    if (produto.precoAntigoTexto && produto.descontoTexto) {
        const areaPrecoAntigo = document.createElement("div");
        areaPrecoAntigo.className = "produto-preco-antigo-area";

        const precoAntigo = document.createElement("span");
        precoAntigo.className = "preco-antigo";
        precoAntigo.textContent = produto.precoAntigoTexto;

        const desconto = document.createElement("span");
        desconto.className = "desconto";
        desconto.textContent = produto.descontoTexto;

        areaPrecoAntigo.appendChild(precoAntigo);
        areaPrecoAntigo.appendChild(desconto);
        linkProduto.appendChild(areaPrecoAntigo);
    }

    const precoAtual = document.createElement("p");
    precoAtual.className = "preco-atual";
    precoAtual.textContent = formatarPrecoInicio(produto.preco);
    linkProduto.appendChild(precoAtual);

    cartao.appendChild(linkProduto);

    const botaoCarrinho = document.createElement("button");
    botaoCarrinho.type = "button";
    botaoCarrinho.className = "btn-carrinho";

    const iconeCarrinho = document.createElement("img");
    iconeCarrinho.src = "img/carrinho-icon.png";
    iconeCarrinho.alt = "";

    const textoCarrinho = document.createElement("p");
    textoCarrinho.textContent = "Adicionar ao carrinho";

    botaoCarrinho.appendChild(iconeCarrinho);
    botaoCarrinho.appendChild(textoCarrinho);
    cartao.appendChild(botaoCarrinho);

    function atualizarBotaoFavorito(favoritado) {
        botaoFavorito.classList.toggle("favoritado", favoritado);
        botaoFavorito.textContent = favoritado ? "♥" : "♡";
        botaoFavorito.setAttribute("aria-pressed", String(favoritado));
        botaoFavorito.setAttribute(
            "aria-label",
            favoritado
                ? `Remover ${produto.nome} dos favoritos`
                : `Adicionar ${produto.nome} aos favoritos`
        );
    }

    atualizarBotaoFavorito(
        armazenamentoFavoritosPaginaInicial.estaFavoritado(produto.id)
    );

    botaoFavorito.addEventListener("click", function () {
        const favoritado =
            armazenamentoFavoritosPaginaInicial.alternar(produto.id);

        atualizarBotaoFavorito(favoritado);
    });

    botaoCarrinho.addEventListener("click", function () {
        armazenamentoCarrinhoPaginaInicial.adicionar({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem
        });

        const textoOriginal = textoCarrinho.textContent;

        textoCarrinho.textContent = "Adicionado!";
        botaoCarrinho.disabled = true;

        window.setTimeout(function () {
            textoCarrinho.textContent = textoOriginal;
            botaoCarrinho.disabled = false;
        }, 1800);
    });

    return cartao;
}

function preencherTrilha(trilha, listaProdutos) {
    const fragmento = document.createDocumentFragment();

    listaProdutos.forEach(function (produto) {
        fragmento.appendChild(
            criarCartaoProdutoInicio(produto)
        );
    });

    trilha.appendChild(fragmento);
}

function configurarCarrosselProdutos(carrossel) {
    const trilha = carrossel.querySelector(".produtos-track");
    const janela = carrossel.querySelector(".produtos-janela");
    const botaoEsquerda =
        carrossel.querySelector('[data-direction="left"]');
    const botaoDireita =
        carrossel.querySelector('[data-direction="right"]');

    let deslocamento = 0;

    function deslocarPara(valor) {
        const primeiroCartao =
            trilha.querySelector(".produto-card");

        if (!primeiroCartao) {
            return;
        }

        const larguraCartao = primeiroCartao.offsetWidth;
        const estiloTrilha =
            window.getComputedStyle(trilha);

        const espaco = parseFloat(
            estiloTrilha.columnGap ||
            estiloTrilha.gap ||
            "0"
        );

        const passo = larguraCartao + espaco;

        const larguraMaxima = Math.max(
            trilha.scrollWidth - janela.clientWidth,
            0
        );

        deslocamento = Math.min(
            0,
            Math.max(valor, -larguraMaxima)
        );

        trilha.style.transform =
            `translateX(${deslocamento}px)`;
    }

    botaoDireita.addEventListener("click", function () {
        const primeiroCartao =
            trilha.querySelector(".produto-card");

        if (!primeiroCartao) {
            return;
        }

        const estiloTrilha =
            window.getComputedStyle(trilha);

        const espaco = parseFloat(
            estiloTrilha.columnGap ||
            estiloTrilha.gap ||
            "0"
        );

        const passo =
            primeiroCartao.offsetWidth + espaco;

        deslocarPara(deslocamento - passo);
    });

    botaoEsquerda.addEventListener("click", function () {
        const primeiroCartao =
            trilha.querySelector(".produto-card");

        if (!primeiroCartao) {
            return;
        }

        const estiloTrilha =
            window.getComputedStyle(trilha);

        const espaco = parseFloat(
            estiloTrilha.columnGap ||
            estiloTrilha.gap ||
            "0"
        );

        const passo =
            primeiroCartao.offsetWidth + espaco;

        deslocarPara(deslocamento + passo);
    });
}

const produtosNovidades =
    PRODUTOS.slice(0, 10);

const produtosMaisVendidos =
    [...PRODUTOS]
        .sort(function (produtoA, produtoB) {
            return produtoB.vendas - produtoA.vendas;
        })
        .slice(0, 10);

const produtosMelhoresOfertas =
    [...PRODUTOS]
        .sort(function (produtoA, produtoB) {
            return (
                extrairPercentualDesconto(
                    produtoB.descontoTexto
                ) -
                extrairPercentualDesconto(
                    produtoA.descontoTexto
                )
            );
        })
        .slice(0, 10);

preencherTrilha(
    document.getElementById("trackNovidades"),
    produtosNovidades
);

preencherTrilha(
    document.getElementById("trackMaisVendidos"),
    produtosMaisVendidos
);

preencherTrilha(
    document.getElementById("trackMelhoresOfertas"),
    produtosMelhoresOfertas
);

document
    .querySelectorAll("[data-carrossel-produtos]")
    .forEach(configurarCarrosselProdutos);