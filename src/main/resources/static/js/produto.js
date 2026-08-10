// mapeia as lojas de favoritos e carrinho
const armazenamentoFavoritosProduto = FavoritosStore;
const armazenamentoCarrinhoProduto = CarrinhoStore;

// formata valor para moeda em real (R$)
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// pega o id do produto na url
const parametros = new URLSearchParams(window.location.search);
const idProduto = parametros.get("id");

// busca o produto no catalogo
const produto = PRODUTOS.find(function (item) {
    return item.id === idProduto;
});

// elementos das secoes da tela
const produtoDetalhes = document.getElementById("produtoDetalhes");
const produtoDescricaoSecao = document.getElementById("produtoDescricaoSecao");
const produtoEspecificacoesSecao = document.getElementById("produtoEspecificacoesSecao");
const produtoNaoEncontrado = document.getElementById("produtoNaoEncontrado");

// mostra erro se o produto nao for encontrado
if (!produto) {
    produtoDetalhes.style.display = "none";
    produtoDescricaoSecao.style.display = "none";
    produtoEspecificacoesSecao.style.display = "none";
    produtoNaoEncontrado.style.display = "block";
} 
// carrega os dados do produto na tela
else {
    // titulo da pagina
    document.title = `${produto.nome} | Zuppy!`;

    // caminho de navegacao (breadcrumb)
    const linkPersonagemNavegacao = document.getElementById("breadcrumbPersonagem");
    linkPersonagemNavegacao.textContent = produto.personagem;
    linkPersonagemNavegacao.href = `todos-produtos.html?personagem=${encodeURIComponent(produto.personagem)}`;

    document.getElementById("breadcrumbNome").textContent = produto.nome;

    // imagens do produto
    const imagemProdutoMiniatura = document.getElementById("imagemProdutoMiniatura");
    imagemProdutoMiniatura.src = produto.imagem;
    imagemProdutoMiniatura.alt = produto.alt || produto.nome;

    const imagemProdutoPrincipal = document.getElementById("imagemProdutoPrincipal");
    imagemProdutoPrincipal.src = produto.imagem;
    imagemProdutoPrincipal.alt = produto.alt || produto.nome;

    // nome do produto
    document.getElementById("produtoNome").textContent = produto.nome;

    // preco antigo e desconto
    const areaPrecoAnterior = document.querySelector(".preco-anterior-area");
    const produtoPrecoAntigo = document.getElementById("produtoPrecoAntigo");
    const produtoDesconto = document.getElementById("produtoDesconto");

    if (produto.precoAntigoTexto && produto.descontoTexto) {
        produtoPrecoAntigo.textContent = produto.precoAntigoTexto;
        produtoDesconto.textContent = produto.descontoTexto;
        areaPrecoAnterior.style.display = "flex";
    } else {
        produtoPrecoAntigo.textContent = "";
        produtoDesconto.textContent = "";
        areaPrecoAnterior.style.display = "none";
    }

    // preco atual
    document.getElementById("produtoPrecoAtual").textContent = formatarPreco(produto.preco);

    // descricao e especificacoes
    document.getElementById("produtoDescricao").textContent =
        `${produto.nome} é um dos destaques da coleção Zuppy!, pensado para trazer diversão, ` +
        `carinho e muitas aventuras. Ideal para colecionar, decorar ou presentear.`;

    document.getElementById("produtoEspecPersonagem").textContent = produto.personagem;
    document.getElementById("produtoEspecVendas").textContent = `${produto.vendas} unidades`;

    // botao de favorito
    const botaoFavorito = document.getElementById("botaoFavorito");

    // atualiza o icone do coracao
    function atualizarBotaoFavorito(favoritado) {
        botaoFavorito.classList.toggle("favoritado", favoritado);
        botaoFavorito.textContent = favoritado ? "♥" : "♡";
        botaoFavorito.setAttribute("aria-pressed", String(favoritado));
        botaoFavorito.setAttribute("aria-label", favoritado
            ? `Remover ${produto.nome} dos favoritos`
            : `Adicionar ${produto.nome} aos favoritos`
        );
    }

    // define o estado inicial do favorito
    atualizarBotaoFavorito(
        armazenamentoFavoritosProduto.estaFavoritado(produto.id)
    );

    // alterna o favorito ao clicar
    botaoFavorito.addEventListener("click", function () {
        const favoritado = armazenamentoFavoritosProduto.alternar(produto.id);
        atualizarBotaoFavorito(favoritado);
    });

    // botao de adicionar ao carrinho
    const botaoAdicionar = document.getElementById("adicionarCarrinho");
    const mensagemCarrinho = document.getElementById("mensagemCarrinho");

    botaoAdicionar.addEventListener("click", function () {
        armazenamentoCarrinhoProduto.adicionar({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem
        });

        mensagemCarrinho.textContent = `${produto.nome} foi adicionado ao carrinho!`;

        // limpa a mensagem depois de 3 segundos
        window.setTimeout(function () {
            mensagemCarrinho.textContent = "";
        }, 3000);
    });

    // botao de comprar agora (adiciona e vai pro carrinho)
    document.getElementById("comprarAgora").addEventListener("click", function () {
        armazenamentoCarrinhoProduto.adicionar({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem
        });

        window.location.href = "carrinho.html";
    });

    // efeito de zoom na imagem principal
    const areaZoomProduto = document.getElementById("areaZoomProduto");

    // ativa o zoom ao passar o mouse
    areaZoomProduto.addEventListener("mouseenter", function () {
        areaZoomProduto.classList.add("zoom-ativo");
    });

    // move o ponto focal do zoom junto com o ponteiro
    areaZoomProduto.addEventListener("mousemove", function (evento) {
        const limites = areaZoomProduto.getBoundingClientRect();

        const posicaoX = evento.clientX - limites.left;
        const posicaoY = evento.clientY - limites.top;

        const percentualX = (posicaoX / limites.width) * 100;
        const percentualY = (posicaoY / limites.height) * 100;

        imagemProdutoPrincipal.style.transformOrigin = `${percentualX}% ${percentualY}%`;
    });

    // desativa o zoom ao tirar o mouse
    areaZoomProduto.addEventListener("mouseleave", function () {
        areaZoomProduto.classList.remove("zoom-ativo");
        imagemProdutoPrincipal.style.transformOrigin = "center";
    });
}