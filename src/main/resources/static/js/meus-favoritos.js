const gradeFavoritos = document.getElementById("gradeFavoritos");
const favoritosVazio = document.getElementById("favoritosVazio");
const quantidadeFavoritosTitulo = document.getElementById("quantidadeFavoritosTitulo");

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarTextoQuantidade(quantidade) {
    return quantidade === 1 ? "1 item" : `${quantidade} itens`;
}

function criarCardFavorito(produto) {
    const artigo = document.createElement("article");
    artigo.className = "card-listagem";
    artigo.dataset.id = produto.id;

    const botaoFavorito = document.createElement("button");
    botaoFavorito.type = "button";
    botaoFavorito.className = "favorito-listagem favoritado";
    botaoFavorito.setAttribute("aria-pressed", "true");
    botaoFavorito.setAttribute("aria-label", `Remover ${produto.nome} dos favoritos`);
    botaoFavorito.textContent = "♥";
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

    botaoFavorito.addEventListener("click", function () {
        FavoritosStore.alternar(produto.id);
        artigo.remove();
        atualizarEstadoVazio();
    });

    botaoAdicionar.addEventListener("click", function () {
        CarrinhoStore.adicionar({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem
        });

        const textoOriginal = botaoAdicionar.innerHTML;

        botaoAdicionar.textContent = "Produto adicionado!";
        botaoAdicionar.disabled = true;

        window.setTimeout(function () {
            botaoAdicionar.innerHTML = textoOriginal;
            botaoAdicionar.disabled = false;
        }, 1800);
    });

    return artigo;
}

function atualizarEstadoVazio() {
    const quantidade = gradeFavoritos.querySelectorAll(".card-listagem").length;

    quantidadeFavoritosTitulo.textContent = formatarTextoQuantidade(quantidade);
    favoritosVazio.classList.toggle("visivel", quantidade === 0);
    gradeFavoritos.style.display = quantidade === 0 ? "none" : "grid";
}

function renderizarFavoritos() {
    gradeFavoritos.innerHTML = "";

    const idsFavoritados = FavoritosStore.listar();

    const produtosFavoritados = idsFavoritados
        .map(function (id) {
            return PRODUTOS.find(function (produto) {
                return produto.id === id;
            });
        })
        .filter(Boolean);

    const fragmento = document.createDocumentFragment();

    produtosFavoritados.forEach(function (produto) {
        fragmento.appendChild(criarCardFavorito(produto));
    });

    gradeFavoritos.appendChild(fragmento);

    atualizarEstadoVazio();
}

renderizarFavoritos();
