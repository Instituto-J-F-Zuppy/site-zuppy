function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

const parametros = new URLSearchParams(window.location.search);
const idProduto = parametros.get("id");

const produto = PRODUTOS.find(function (item) {
    return item.id === idProduto;
});

const produtoDetalhes = document.getElementById("produtoDetalhes");
const produtoDescricaoSecao = document.getElementById("produtoDescricaoSecao");
const produtoEspecificacoesSecao = document.getElementById("produtoEspecificacoesSecao");
const produtoNaoEncontrado = document.getElementById("produtoNaoEncontrado");

if (!produto) {
    produtoDetalhes.style.display = "none";
    produtoDescricaoSecao.style.display = "none";
    produtoEspecificacoesSecao.style.display = "none";
    produtoNaoEncontrado.style.display = "block";
} else {
    document.title = `${produto.nome} | Zuppy!`;

    document.getElementById("breadcrumbPersonagem").textContent = produto.personagem;
    document.getElementById("breadcrumbPersonagem").href =
        `todos-produtos.html?personagem=${encodeURIComponent(produto.personagem)}`;
    document.getElementById("breadcrumbNome").textContent = produto.nome;

    document.getElementById("imagemProdutoMiniatura").src = produto.imagem;
    document.getElementById("imagemProdutoMiniatura").alt = produto.alt || produto.nome;

    const imagemProdutoPrincipal = document.getElementById("imagemProdutoPrincipal");
    imagemProdutoPrincipal.src = produto.imagem;
    imagemProdutoPrincipal.alt = produto.alt || produto.nome;

    document.getElementById("produtoNome").textContent = produto.nome;
    document.getElementById("produtoPrecoAntigo").textContent = produto.precoAntigoTexto;
    document.getElementById("produtoDesconto").textContent = produto.descontoTexto;
    document.getElementById("produtoPrecoAtual").textContent = formatarPreco(produto.preco);
    document.getElementById("produtoDescricao").textContent =
        `${produto.nome} é um dos destaques da coleção Zuppy!, pensado para trazer diversão, ` +
        `carinho e muitas aventuras. Ideal para colecionar, decorar ou presentear.`;
    document.getElementById("produtoEspecPersonagem").textContent = produto.personagem;
    document.getElementById("produtoEspecVendas").textContent = `${produto.vendas} unidades`;

    const botaoFavorito = document.getElementById("botaoFavorito");

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

    atualizarBotaoFavorito(FavoritosStore.estaFavoritado(produto.id));

    botaoFavorito.addEventListener("click", function () {
        const favoritado = FavoritosStore.alternar(produto.id);
        atualizarBotaoFavorito(favoritado);
    });

    const botaoAdicionar = document.getElementById("adicionarCarrinho");
    const mensagemCarrinho = document.getElementById("mensagemCarrinho");

    botaoAdicionar.addEventListener("click", function () {
        CarrinhoStore.adicionar({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem
        });

        mensagemCarrinho.textContent = `${produto.nome} foi adicionado ao carrinho!`;

        window.setTimeout(function () {
            mensagemCarrinho.textContent = "";
        }, 3000);
    });

    document.getElementById("comprarAgora").addEventListener("click", function () {
        CarrinhoStore.adicionar({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem
        });

        window.location.href = "carrinho.html";
    });

    const areaZoomProduto = document.getElementById("areaZoomProduto");

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
}
