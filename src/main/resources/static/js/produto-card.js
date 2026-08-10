// formata valor numérico para moeda em real (R$)
function formatarPrecoBRL(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// fabrica o esqueleto html completo do card de produto
function criarEsqueletoCardListagem(produto) {
    // cria a tag principal e armazena os dados no dataset
    const artigo = document.createElement("article");
    artigo.className = "card-listagem";
    artigo.dataset.id = produto.id;
    artigo.dataset.nome = produto.nome;
    artigo.dataset.personagem = produto.personagem;
    artigo.dataset.preco = String(produto.preco);
    artigo.dataset.vendas = String(produto.vendas);

    // cria o botao de favoritar
    const botaoFavorito = document.createElement("button");
    botaoFavorito.type = "button";
    botaoFavorito.className = "favorito-listagem";
    botaoFavorito.setAttribute("aria-pressed", "false");
    botaoFavorito.setAttribute("aria-label", `Adicionar ${produto.nome} aos favoritos`);
    botaoFavorito.textContent = "♡";
    artigo.appendChild(botaoFavorito);

    // cria o link para a pagina do produto
    const linkProduto = document.createElement("a");
    linkProduto.className = "link-card-listagem";
    linkProduto.href = `produto.html?id=${encodeURIComponent(produto.id)}`;

    // monta a imagem
    const areaImagem = document.createElement("div");
    areaImagem.className = "imagem-card-listagem";

    const imagemProduto = document.createElement("img");
    imagemProduto.src = produto.imagem;
    imagemProduto.alt = produto.alt || produto.nome;
    imagemProduto.loading = "lazy";

    areaImagem.appendChild(imagemProduto);
    linkProduto.appendChild(areaImagem);

    // coloca a tag promocional
    const etiqueta = document.createElement("span");
    etiqueta.className = "tag-listagem";
    etiqueta.textContent = "Só no Zuppy!";
    linkProduto.appendChild(etiqueta);

    // titulo do produto
    const titulo = document.createElement("h2");
    titulo.textContent = produto.nome;
    linkProduto.appendChild(titulo);

    // insere o preco antigo e desconto se existirem
    if (produto.precoAntigoTexto && produto.descontoTexto) {
        const areaPrecoAntigo = document.createElement("div");
        areaPrecoAntigo.className = "preco-antigo-listagem";

        const precoAntigo = document.createElement("span");
        precoAntigo.textContent = produto.precoAntigoTexto;

        const desconto = document.createElement("strong");
        desconto.textContent = produto.descontoTexto;

        areaPrecoAntigo.appendChild(precoAntigo);
        areaPrecoAntigo.appendChild(desconto);
        linkProduto.appendChild(areaPrecoAntigo);
    }

    // preco atual
    const precoAtual = document.createElement("p");
    precoAtual.className = "preco-atual-listagem";
    precoAtual.textContent = formatarPrecoBRL(produto.preco);
    linkProduto.appendChild(precoAtual);

    artigo.appendChild(linkProduto);

    // cria o botao de adicionar ao carrinho
    const botaoAdicionar = document.createElement("button");
    botaoAdicionar.type = "button";
    botaoAdicionar.className = "adicionar-listagem";

    const iconeCarrinho = document.createElement("img");
    iconeCarrinho.src = "img/carrinho-icon.png";
    iconeCarrinho.alt = "";

    botaoAdicionar.appendChild(iconeCarrinho);
    botaoAdicionar.appendChild(document.createTextNode("Adicionar ao carrinho"));
    artigo.appendChild(botaoAdicionar);

    // retorna os elementos criados para uso nos eventos
    return {
        artigo: artigo,
        botaoFavorito: botaoFavorito,
        botaoAdicionar: botaoAdicionar
    };
}