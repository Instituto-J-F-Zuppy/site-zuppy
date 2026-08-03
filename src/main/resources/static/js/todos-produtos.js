const gradeProdutos = document.getElementById("gradeProdutos");

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function criarCardProduto(produto) {
    const artigo = document.createElement("article");
    artigo.className = "card-listagem";
    artigo.dataset.id = produto.id;
    artigo.dataset.nome = produto.nome;
    artigo.dataset.personagem = produto.personagem;
    artigo.dataset.preco = String(produto.preco);
    artigo.dataset.vendas = String(produto.vendas);

    const botaoFavorito = document.createElement("button");
    botaoFavorito.type = "button";
    botaoFavorito.className = "favorito-listagem";
    botaoFavorito.setAttribute("aria-pressed", "false");
    botaoFavorito.setAttribute("aria-label", "Adicionar produto aos favoritos");
    botaoFavorito.textContent = "♡";
    artigo.appendChild(botaoFavorito);

    const link = document.createElement("a");
    link.className = "link-card-listagem";
    link.href = `produto.html?id=${encodeURIComponent(produto.id)}`;

    const areaImagem = document.createElement("div");
    areaImagem.className = "imagem-card-listagem";
    const imagem = document.createElement("img");
    imagem.src = produto.imagem;
    imagem.alt = produto.alt || "";
    areaImagem.appendChild(imagem);
    link.appendChild(areaImagem);

    const tag = document.createElement("span");
    tag.className = "tag-listagem";
    tag.textContent = "Só no Zuppy!";
    link.appendChild(tag);

    const titulo = document.createElement("h2");
    titulo.textContent = produto.nome;
    link.appendChild(titulo);

    const precoAntigoArea = document.createElement("div");
    precoAntigoArea.className = "preco-antigo-listagem";
    const precoAntigoSpan = document.createElement("span");
    precoAntigoSpan.textContent = produto.precoAntigoTexto;
    const descontoStrong = document.createElement("strong");
    descontoStrong.textContent = produto.descontoTexto;
    precoAntigoArea.appendChild(precoAntigoSpan);
    precoAntigoArea.appendChild(descontoStrong);
    link.appendChild(precoAntigoArea);

    const precoAtual = document.createElement("p");
    precoAtual.className = "preco-atual-listagem";
    precoAtual.textContent = formatarPreco(produto.preco);
    link.appendChild(precoAtual);

    artigo.appendChild(link);

    const botaoAdicionar = document.createElement("button");
    botaoAdicionar.type = "button";
    botaoAdicionar.className = "adicionar-listagem";
    const iconeCarrinho = document.createElement("img");
    iconeCarrinho.src = "img/carrinho-icon.png";
    iconeCarrinho.alt = "";
    botaoAdicionar.appendChild(iconeCarrinho);
    botaoAdicionar.appendChild(document.createTextNode("Adicionar ao carrinho"));
    artigo.appendChild(botaoAdicionar);

    return artigo;
}

function renderizarProdutos() {
    const fragmento = document.createDocumentFragment();

    PRODUTOS.forEach(function (produto) {
        fragmento.appendChild(criarCardProduto(produto));
    });

    gradeProdutos.appendChild(fragmento);
}

renderizarProdutos();

const produtos = Array.from(
    document.querySelectorAll(".card-listagem")
);

const quantidadeProdutos = document.getElementById(
    "quantidadeProdutos"
);

const nenhumProduto = document.getElementById(
    "nenhumProduto"
);

const buscaPrincipal = document.getElementById(
    "searchInput"
);

const buscaFiltro = document.getElementById(
    "buscaFiltro"
);

const filtroPreco = document.getElementById(
    "filtroPreco"
);

const precoSelecionado = document.getElementById(
    "precoSelecionado"
);

const filtrosPersonagem = document.querySelectorAll(
    ".filtro-personagem"
);

const ordenarMenorPreco = document.getElementById(
    "ordenarMenorPreco"
);

const ordenarMaisVendidos = document.getElementById(
    "ordenarMaisVendidos"
);

let ordenacaoAtual = "";

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}


function aplicarFiltroPersonagemDaUrl() {
    const parametros = new URLSearchParams(window.location.search);
    const personagem = parametros.get("personagem");
    if (!personagem) return;
    const personagemNormalizado = normalizarTexto(personagem);
    const filtroCorrespondente = Array.from(filtrosPersonagem).find(function (filtro) {
        return normalizarTexto(filtro.value) === personagemNormalizado;
    });
    if (!filtroCorrespondente) return;
    filtroCorrespondente.checked = true;
    const titulo = document.querySelector(".cabecalho-listagem h1");
    if (titulo) titulo.textContent = `Produtos de ${filtroCorrespondente.value}`;
}

function obterPersonagensSelecionados() {
    return Array.from(filtrosPersonagem)
        .filter(function (checkbox) {
            return checkbox.checked;
        })
        .map(function (checkbox) {
            return normalizarTexto(checkbox.value);
        });
}

function atualizarProdutos() {
    const buscaGeral = normalizarTexto(
        buscaPrincipal.value.trim()
    );

    const buscaLateral = normalizarTexto(
        buscaFiltro.value.trim()
    );

    const precoMaximo = Number(filtroPreco.value);

    const personagensSelecionados =
        obterPersonagensSelecionados();

    let quantidadeVisivel = 0;

    produtos.forEach(function (produto) {
        const nome = normalizarTexto(
            produto.dataset.nome
        );

        const personagem = normalizarTexto(
            produto.dataset.personagem
        );

        const preco = Number(produto.dataset.preco);

        const correspondeBuscaGeral =
            nome.includes(buscaGeral);

        const correspondeBuscaLateral =
            nome.includes(buscaLateral) ||
            personagem.includes(buscaLateral);

        const correspondePreco =
            preco <= precoMaximo;

        const correspondePersonagem =
            personagensSelecionados.length === 0 ||
            personagensSelecionados.includes(personagem);

        const produtoVisivel =
            correspondeBuscaGeral &&
            correspondeBuscaLateral &&
            correspondePreco &&
            correspondePersonagem;

        produto.classList.toggle(
            "oculto",
            !produtoVisivel
        );

        if (produtoVisivel) {
            quantidadeVisivel++;
        }
    });

    quantidadeProdutos.textContent = quantidadeVisivel;

    nenhumProduto.classList.toggle(
        "visivel",
        quantidadeVisivel === 0
    );
}

function ordenarProdutos(tipo) {
    const produtosOrdenados = [...produtos];

    produtosOrdenados.sort(function (produtoA, produtoB) {
        if (tipo === "preco") {
            return (
                Number(produtoA.dataset.preco) -
                Number(produtoB.dataset.preco)
            );
        }

        if (tipo === "vendas") {
            return (
                Number(produtoB.dataset.vendas) -
                Number(produtoA.dataset.vendas)
            );
        }

        return 0;
    });

    produtosOrdenados.forEach(function (produto) {
        gradeProdutos.appendChild(produto);
    });
}

function atualizarPrecoSelecionado() {
    precoSelecionado.textContent =
        Number(filtroPreco.value).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    const percentual =
        (Number(filtroPreco.value) /
            Number(filtroPreco.max)) *
        100;

    precoSelecionado.style.marginLeft =
        `calc(${percentual}% - 35px)`;
}

buscaPrincipal.addEventListener(
    "input",
    atualizarProdutos
);

buscaFiltro.addEventListener(
    "input",
    atualizarProdutos
);

filtroPreco.addEventListener("input", function () {
    atualizarPrecoSelecionado();
    atualizarProdutos();
});

filtrosPersonagem.forEach(function (checkbox) {
    checkbox.addEventListener(
        "change",
        atualizarProdutos
    );
});

ordenarMenorPreco.addEventListener(
    "click",
    function () {
        ordenacaoAtual = "preco";

        ordenarProdutos(ordenacaoAtual);

        ordenarMenorPreco.classList.add("ativo");
        ordenarMaisVendidos.classList.remove("ativo");
    }
);

ordenarMaisVendidos.addEventListener(
    "click",
    function () {
        ordenacaoAtual = "vendas";

        ordenarProdutos(ordenacaoAtual);

        ordenarMaisVendidos.classList.add("ativo");
        ordenarMenorPreco.classList.remove("ativo");
    }
);

function atualizarBotaoFavorito(botao, favoritado) {
    botao.classList.toggle("favoritado", favoritado);
    botao.textContent = favoritado ? "♥" : "♡";
    botao.setAttribute("aria-pressed", String(favoritado));
    botao.setAttribute(
        "aria-label",
        favoritado
            ? "Remover produto dos favoritos"
            : "Adicionar produto aos favoritos"
    );
}

produtos.forEach(function (produtoCard) {
    const botao = produtoCard.querySelector(".favorito-listagem");
    const id = produtoCard.dataset.id;

    atualizarBotaoFavorito(botao, FavoritosStore.estaFavoritado(id));

    botao.addEventListener("click", function () {
        const favoritado = FavoritosStore.alternar(id);
        atualizarBotaoFavorito(botao, favoritado);
    });
});

produtos.forEach(function (produtoCard) {
    const botao = produtoCard.querySelector(".adicionar-listagem");
    const id = produtoCard.dataset.id;
    const produto = PRODUTOS.find(function (item) {
        return item.id === id;
    });

    botao.addEventListener("click", function () {
        CarrinhoStore.adicionar({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem
        });

        const textoOriginal = botao.innerHTML;

        botao.textContent = "Produto adicionado!";
        botao.disabled = true;

        window.setTimeout(function () {
            botao.innerHTML = textoOriginal;
            botao.disabled = false;
        }, 1800);
    });
});

aplicarFiltroPersonagemDaUrl();
atualizarPrecoSelecionado();
atualizarProdutos();
