const gradeFavoritos = document.getElementById("gradeFavoritos");
const favoritosVazio = document.getElementById("favoritosVazio");
const quantidadeFavoritosTitulo = document.getElementById("quantidadeFavoritosTitulo");

function formatarTextoQuantidade(quantidade) {
    return quantidade === 1 ? "1 item" : `${quantidade} itens`;
}

function criarCardFavorito(produto) {
    const { artigo, botaoFavorito, botaoAdicionar } = criarEsqueletoCardListagem(produto);

    botaoFavorito.className = "favorito-listagem favoritado";
    botaoFavorito.setAttribute("aria-pressed", "true");
    botaoFavorito.setAttribute("aria-label", `Remover ${produto.nome} dos favoritos`);
    botaoFavorito.textContent = "♥";

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
