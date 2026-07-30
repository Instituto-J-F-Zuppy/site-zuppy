const botaoFavorito = document.getElementById("botaoFavorito");
const botaoAdicionar = document.getElementById("adicionarCarrinho");
const botaoComprar = document.getElementById("comprarAgora");
const mensagemCarrinho = document.getElementById("mensagemCarrinho");

let produtoFavoritado = false;

botaoFavorito.addEventListener("click", function () {
    produtoFavoritado = !produtoFavoritado;

    botaoFavorito.classList.toggle("favoritado", produtoFavoritado);
    botaoFavorito.textContent = produtoFavoritado ? "♥" : "♡";
    botaoFavorito.setAttribute("aria-pressed", String(produtoFavoritado));
    botaoFavorito.setAttribute(
        "aria-label",
        produtoFavoritado
            ? "Remover Júlio Craque dos favoritos"
            : "Adicionar Júlio Craque aos favoritos"
    );
});

function obterDadosProduto() {
    return{
        id: Number(botaoAdicionar.dataset.id),
        nome: botaoAdicionar.dataset.nome,
        preco: Number(botaoAdicionar.dataset.preco),
        imagem: botaoAdicionar.dataset.imagem
    }
}

botaoAdicionar.addEventListener("click", function () {
    CarrinhoStore.adicionar(obterDadosProduto());
    mensagemCarrinho.textContent = "Júlio Craque foi adicionado ao carrinho!";

    window.setTimeout(function () {
        mensagemCarrinho.textContent = "";
    }, 3000);
});

botaoComprar.addEventListener("click", function () {
    CarrinhoStore.adicionar(obterDadosProduto());
    window.location.href = "carrinho.html";
});

const areaZoomProduto = document.getElementById("areaZoomProduto");
const imagemProdutoPrincipal = document.getElementById("imagemProdutoPrincipal");

areaZoomProduto.addEventListener("mouseenter", function () {
    areaZoomProduto.classList.add("zoom-ativo");
});

areaZoomProduto.addEventListener("mousemove", function (evento) {
    const limites = areaZoomProduto.getBoundingClientRect();

    const posicaoX = evento.clientX - limites.left;
    const posicaoY = evento.clientY - limites.top;

    const percentualX = (posicaoX / limites.width) * 100;
    const percentualY = (posicaoY / limites.height) * 100;

    imagemProdutoPrincipal.style.transformOrigin =
        `${percentualX}% ${percentualY}%`;
});

areaZoomProduto.addEventListener("mouseleave", function () {
    areaZoomProduto.classList.remove("zoom-ativo");
    imagemProdutoPrincipal.style.transformOrigin = "center";
});
