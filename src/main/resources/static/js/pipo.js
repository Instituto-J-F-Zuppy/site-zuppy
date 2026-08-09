const botoesFavoritoRelacionados = document.querySelectorAll(
    ".favorito-produto-relacionado"
);

const botoesAdicionarRelacionados = document.querySelectorAll(
    ".adicionar-produto-relacionado"
);

const mensagemProdutoAdicionado = document.getElementById(
    "mensagemProdutoAdicionado"
);

botoesFavoritoRelacionados.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const favoritado = botao.classList.toggle("favoritado");

        botao.textContent = favoritado ? "♥" : "♡";
        botao.setAttribute("aria-pressed", String(favoritado));

        const nomeProduto = botao
            .closest(".card-produto-relacionado")
            .querySelector("h3")
            .textContent
            .trim();

        botao.setAttribute(
            "aria-label",
            favoritado
                ? `Remover ${nomeProduto} dos favoritos`
                : `Adicionar ${nomeProduto} aos favoritos`
        );
    });
});

botoesAdicionarRelacionados.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const nomeProduto = botao.dataset.produto;
        const textoBotao = botao.querySelector("span");

        textoBotao.textContent = "Produto adicionado";
        botao.classList.add("produto-adicionado");
        botao.disabled = true;

        if (mensagemProdutoAdicionado) {
            mensagemProdutoAdicionado.textContent =
                `${nomeProduto} foi adicionado ao carrinho.`;
        }

        window.setTimeout(function () {
            textoBotao.textContent = "Adicionar ao carrinho";
            botao.classList.remove("produto-adicionado");
            botao.disabled = false;

            if (mensagemProdutoAdicionado) {
                mensagemProdutoAdicionado.textContent = "";
            }
        }, 2200);
    });
});