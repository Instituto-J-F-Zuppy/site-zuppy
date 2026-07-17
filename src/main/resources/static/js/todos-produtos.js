const gradeProdutos = document.getElementById("gradeProdutos");
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

const botoesFavorito = document.querySelectorAll(
    ".favorito-listagem"
);

let ordenacaoAtual = "";

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
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

botoesFavorito.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const favoritado =
            botao.classList.toggle("favoritado");

        botao.textContent = favoritado ? "♥" : "♡";

        botao.setAttribute(
            "aria-pressed",
            String(favoritado)
        );

        botao.setAttribute(
            "aria-label",
            favoritado
                ? "Remover produto dos favoritos"
                : "Adicionar produto aos favoritos"
        );
    });
});

document
    .querySelectorAll(".adicionar-listagem")
    .forEach(function (botao) {
        botao.addEventListener("click", function () {
            const textoOriginal = botao.innerHTML;

            botao.textContent =
                "Produto adicionado!";

            botao.disabled = true;

            window.setTimeout(function () {
                botao.innerHTML = textoOriginal;
                botao.disabled = false;
            }, 1800);
        });
    });

atualizarPrecoSelecionado();
atualizarProdutos();