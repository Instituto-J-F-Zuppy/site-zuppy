// Monta o esqueleto de um card de produto (markup ".card-listagem", usado em
// todos-produtos.html e meus-favoritos.html). Cada página fica responsável por
// ligar o comportamento dos botões (favorito/adicionar), já que ele muda de
// uma página pra outra -- aqui só fica a parte que é sempre igual.

function formatarPrecoBRL(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function criarEsqueletoCardListagem(produto) {
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
    imagem.loading = "lazy";
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
    precoAtual.textContent = formatarPrecoBRL(produto.preco);
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

    return { artigo, botaoFavorito, botaoAdicionar };
}
