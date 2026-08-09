function formatarPrecoIndex(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function extrairPercentualDesconto(descontoTexto) {
    const numero = parseInt(descontoTexto, 10);
    return Number.isNaN(numero) ? 0 : numero;
}

function criarCardProdutoIndex(produto) {
    const card = document.createElement("div");
    card.className = "produto-card";
    card.dataset.id = produto.id;

    const botaoFavorito = document.createElement("button");
    botaoFavorito.type = "button";
    botaoFavorito.className = "favorito-btn";
    botaoFavorito.setAttribute("aria-pressed", "false");
    botaoFavorito.setAttribute("aria-label", "Adicionar produto aos favoritos");
    botaoFavorito.textContent = "♡";
    card.appendChild(botaoFavorito);

    const link = document.createElement("a");
    link.className = "produto-card-link";
    link.href = `produto.html?id=${encodeURIComponent(produto.id)}`;

    const areaImagem = document.createElement("div");
    areaImagem.className = "produto-img-area";
    const imagem = document.createElement("img");
    imagem.src = produto.imagem;
    imagem.alt = produto.alt || produto.nome;
    imagem.loading = "lazy";
    areaImagem.appendChild(imagem);
    link.appendChild(areaImagem);

    const tag = document.createElement("span");
    tag.className = "produto-tag";
    tag.textContent = "Só no Zuppy!";
    link.appendChild(tag);

    const titulo = document.createElement("h3");
    titulo.textContent = produto.nome;
    link.appendChild(titulo);

    const precoAntigoArea = document.createElement("div");
    precoAntigoArea.className = "produto-preco-antigo-area";
    const precoAntigoSpan = document.createElement("span");
    precoAntigoSpan.className = "preco-antigo";
    precoAntigoSpan.textContent = produto.precoAntigoTexto;
    const descontoSpan = document.createElement("span");
    descontoSpan.className = "desconto";
    descontoSpan.textContent = produto.descontoTexto;
    precoAntigoArea.appendChild(precoAntigoSpan);
    precoAntigoArea.appendChild(descontoSpan);
    link.appendChild(precoAntigoArea);

    const precoAtual = document.createElement("p");
    precoAtual.className = "preco-atual";
    precoAtual.textContent = formatarPrecoIndex(produto.preco);
    link.appendChild(precoAtual);

    card.appendChild(link);

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
    card.appendChild(botaoCarrinho);

    function atualizarBotaoFavorito(favoritado) {
        botaoFavorito.classList.toggle("favoritado", favoritado);
        botaoFavorito.textContent = favoritado ? "♥" : "♡";
        botaoFavorito.setAttribute("aria-pressed", String(favoritado));
        botaoFavorito.setAttribute(
            "aria-label",
            favoritado
                ? "Remover produto dos favoritos"
                : "Adicionar produto aos favoritos"
        );
    }

    atualizarBotaoFavorito(FavoritosStore.estaFavoritado(produto.id));

    botaoFavorito.addEventListener("click", function () {
        atualizarBotaoFavorito(FavoritosStore.alternar(produto.id));
    });

    botaoCarrinho.addEventListener("click", function () {
        CarrinhoStore.adicionar({
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

    return card;
}

function preencherTrack(track, produtos) {
    const fragmento = document.createDocumentFragment();
    produtos.forEach(function (produto) {
        fragmento.appendChild(criarCardProdutoIndex(produto));
    });
    track.appendChild(fragmento);
}

function configurarSlideCarrossel(carrossel) {
    const track = carrossel.querySelector(".produtos-track");
    const janela = carrossel.querySelector(".produtos-janela");
    const botaoEsquerda = carrossel.querySelector('[data-direction="left"]');
    const botaoDireita = carrossel.querySelector('[data-direction="right"]');

    let deslocamento = 0;

    function deslocarPara(valor) {
        const primeiroCard = track.querySelector(".produto-card");
        if (!primeiroCard) return;

        const larguraCard = primeiroCard.offsetWidth;
        const estiloTrack = window.getComputedStyle(track);
        const gap = parseFloat(estiloTrack.columnGap || estiloTrack.gap || "0");
        const passo = larguraCard + gap;

        const larguraMaxima = Math.max(track.scrollWidth - janela.clientWidth, 0);

        deslocamento = Math.min(0, Math.max(valor, -larguraMaxima));

        track.style.transform = `translateX(${deslocamento}px)`;
    }

    botaoDireita.addEventListener("click", function () {
        const primeiroCard = track.querySelector(".produto-card");
        if (!primeiroCard) return;
        const estiloTrack = window.getComputedStyle(track);
        const gap = parseFloat(estiloTrack.columnGap || estiloTrack.gap || "0");
        const passo = primeiroCard.offsetWidth + gap;
        deslocarPara(deslocamento - passo);
    });

    botaoEsquerda.addEventListener("click", function () {
        const primeiroCard = track.querySelector(".produto-card");
        if (!primeiroCard) return;
        const estiloTrack = window.getComputedStyle(track);
        const gap = parseFloat(estiloTrack.columnGap || estiloTrack.gap || "0");
        const passo = primeiroCard.offsetWidth + gap;
        deslocarPara(deslocamento + passo);
    });
}

const produtosNovidades = PRODUTOS.slice(0, 10);

const produtosMaisVendidos = [...PRODUTOS]
    .sort(function (a, b) { return b.vendas - a.vendas; })
    .slice(0, 10);

const produtosMelhoresOfertas = [...PRODUTOS]
    .sort(function (a, b) {
        return extrairPercentualDesconto(b.descontoTexto) - extrairPercentualDesconto(a.descontoTexto);
    })
    .slice(0, 10);

preencherTrack(document.getElementById("trackNovidades"), produtosNovidades);
preencherTrack(document.getElementById("trackMaisVendidos"), produtosMaisVendidos);
preencherTrack(document.getElementById("trackMelhoresOfertas"), produtosMelhoresOfertas);

document.querySelectorAll("[data-carrossel-produtos]").forEach(configurarSlideCarrossel);
