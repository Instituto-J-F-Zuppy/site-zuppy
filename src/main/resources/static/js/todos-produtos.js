// elemento onde os produtos serao inseridos
const gradeProdutos = document.getElementById("gradeProdutos");

// cria o elemento card do produto
function criarCardProduto(produto) {
    return criarEsqueletoCardListagem(produto).artigo;
}

// renderiza todos os produtos na tela usando fragmento
function renderizarProdutos() {
    const fragmento = document.createDocumentFragment();

    PRODUTOS.forEach(function (produto) {
        fragmento.appendChild(criarCardProduto(produto));
    });

    gradeProdutos.appendChild(fragmento);
}

// executa a renderizacao inicial
renderizarProdutos();

// pega a lista de cards gerados e os elementos de filtro/busca
const produtos = Array.from(
    document.querySelectorAll(".card-listagem")
);

const quantidadeProdutos = document.getElementById("quantidadeProdutos");
const nenhumProduto = document.getElementById("nenhumProduto");
const buscaPrincipal = document.getElementById("searchInput");
const buscaFiltro = document.getElementById("buscaFiltro");
const filtroPreco = document.getElementById("filtroPreco");
const precoSelecionado = document.getElementById("precoSelecionado");
const filtrosPersonagem = document.querySelectorAll(".filtro-personagem");
const ordenarMenorPreco = document.getElementById("ordenarMenorPreco");
const ordenarMaisVendidos = document.getElementById("ordenarMaisVendidos");

let ordenacaoAtual = "";

// limita a frequencia de execucao de uma funcao
function debounce(funcao, atrasoMs) {
    let temporizador = null;

    return function (...argumentos) {
        window.clearTimeout(temporizador);
        temporizador = window.setTimeout(function () {
            funcao.apply(null, argumentos);
        }, atrasoMs);
    };
}

// remove acentos e converte texto para minusculo
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}

// le a url e marca o filtro de personagem correspondente
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

// retorna lista de personagens selecionados nos checkboxes
function obterPersonagensSelecionados() {
    return Array.from(filtrosPersonagem)
        .filter(function (checkbox) {
            return checkbox.checked;
        })
        .map(function (checkbox) {
            return normalizarTexto(checkbox.value);
        });
}

// filtra os produtos na tela com base nos filtros ativos
function atualizarProdutos() {
    const buscaGeral = normalizarTexto(buscaPrincipal.value.trim());
    const buscaLateral = normalizarTexto(buscaFiltro.value.trim());
    const precoMaximo = Number(filtroPreco.value);
    const personagensSelecionados = obterPersonagensSelecionados();

    let quantidadeVisivel = 0;

    produtos.forEach(function (produto) {
        const nome = normalizarTexto(produto.dataset.nome);
        const personagem = normalizarTexto(produto.dataset.personagem);
        const preco = Number(produto.dataset.preco);

        const correspondeBuscaGeral = nome.includes(buscaGeral);
        const correspondeBuscaLateral = nome.includes(buscaLateral) || personagem.includes(buscaLateral);
        const correspondePreco = preco <= precoMaximo;
        const correspondePersonagem = personagensSelecionados.length === 0 || personagensSelecionados.includes(personagem);

        const produtoVisivel = correspondeBuscaGeral && correspondeBuscaLateral && correspondePreco && correspondePersonagem;

        produto.classList.toggle("oculto", !produtoVisivel);

        if (produtoVisivel) {
            quantidadeVisivel++;
        }
    });

    quantidadeProdutos.textContent = quantidadeVisivel;
    nenhumProduto.classList.toggle("visivel", quantidadeVisivel === 0);
}

// reordena os elementos da grade no dom
function ordenarProdutos(tipo) {
    const produtosOrdenados = [...produtos];

    produtosOrdenados.sort(function (produtoA, produtoB) {
        if (tipo === "preco") {
            return Number(produtoA.dataset.preco) - Number(produtoB.dataset.preco);
        }

        if (tipo === "vendas") {
            return Number(produtoB.dataset.vendas) - Number(produtoA.dataset.vendas);
        }

        return 0;
    });

    produtosOrdenados.forEach(function (produto) {
        gradeProdutos.appendChild(produto);
    });
}

// atualiza o texto do valor do slider de preco
function atualizarPrecoSelecionado() {
    precoSelecionado.textContent = Number(filtroPreco.value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const percentual = (Number(filtroPreco.value) / Number(filtroPreco.max)) * 100;
    precoSelecionado.style.marginLeft = `calc(${percentual}% - 35px)`;
}

// versao debounced da atualizacao de busca
const atualizarProdutosComAtraso = debounce(atualizarProdutos, 200);

// ouvintes para os campos de busca e preco
buscaPrincipal.addEventListener("input", atualizarProdutosComAtraso);
buscaFiltro.addEventListener("input", atualizarProdutosComAtraso);

filtroPreco.addEventListener("input", function () {
    atualizarPrecoSelecionado();
    atualizarProdutos();
});

filtrosPersonagem.forEach(function (checkbox) {
    checkbox.addEventListener("change", atualizarProdutos);
});

// botoes de ordenacao
ordenarMenorPreco.addEventListener("click", function () {
    ordenacaoAtual = "preco";
    ordenarProdutos(ordenacaoAtual);
    ordenarMenorPreco.classList.add("ativo");
    ordenarMaisVendidos.classList.remove("ativo");
});

ordenarMaisVendidos.addEventListener("click", function () {
    ordenacaoAtual = "vendas";
    ordenarProdutos(ordenacaoAtual);
    ordenarMaisVendidos.classList.add("ativo");
    ordenarMenorPreco.classList.remove("ativo");
});

// atualiza o visual do botao favorito
function atualizarBotaoFavorito(botao, favoritado) {
    botao.classList.toggle("favoritado", favoritado);
    botao.textContent = favoritado ? "♥" : "♡";
    botao.setAttribute("aria-pressed", String(favoritado));
    botao.setAttribute(
        "aria-label",
        favoritado ? "Remover produto dos favoritos" : "Adicionar produto aos favoritos"
    );
}

// configura o evento de favoritar em cada card
produtos.forEach(function (produtoCard) {
    const botao = produtoCard.querySelector(".favorito-listagem");
    const id = produtoCard.dataset.id;

    atualizarBotaoFavorito(botao, FavoritosStore.estaFavoritado(id));

    botao.addEventListener("click", function () {
        const favoritado = FavoritosStore.alternar(id);
        atualizarBotaoFavorito(botao, favoritado);
    });
});

// configura o evento de adicionar ao carrinho em cada card
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

// inicializacao dos filtros na carga
aplicarFiltroPersonagemDaUrl();
atualizarPrecoSelecionado();
atualizarProdutos();