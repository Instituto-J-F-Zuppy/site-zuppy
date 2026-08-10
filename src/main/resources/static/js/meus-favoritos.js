// busca a grade onde os cards dos favoritos vao aparecer
const gradeFavoritos = document.getElementById("gradeFavoritos");

// busca o aviso de favoritos vazio
const favoritosVazio = document.getElementById("favoritosVazio");

// busca o texto da quantidade total de favoritos
const quantidadeFavoritosTitulo = document.getElementById("quantidadeFavoritosTitulo");

// formata a quantidade no singular ou plural
function formatarTextoQuantidade(quantidade) {
    return quantidade === 1 ? "1 item" : `${quantidade} itens`;
}

// cria o card do produto favoritado
function criarCardFavorito(produto) {
    // pega a estrutura base do card
    const { artigo, botaoFavorito, botaoAdicionar } = criarEsqueletoCardListagem(produto);

    // deixa o botao de favorito como ativo
    botaoFavorito.className = "favorito-listagem favoritado";
    botaoFavorito.setAttribute("aria-pressed", "true");
    botaoFavorito.setAttribute("aria-label", `Remover ${produto.nome} dos favoritos`);
    botaoFavorito.textContent = "♥";

    // remove o produto dos favoritos e da tela ao clicar
    botaoFavorito.addEventListener("click", function () {
        FavoritosStore.alternar(produto.id);
        artigo.remove();
        atualizarEstadoVazio();
    });

    // adiciona o produto ao carrinho
    botaoAdicionar.addEventListener("click", function () {
        CarrinhoStore.adicionar({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem
        });

        const textoOriginal = botaoAdicionar.innerHTML;

        // da o aviso de que foi adicionado
        botaoAdicionar.textContent = "Produto adicionado!";
        botaoAdicionar.disabled = true;

        // volta o botao ao normal depois de um tempo
        window.setTimeout(function () {
            botaoAdicionar.innerHTML = textoOriginal;
            botaoAdicionar.disabled = false;
        }, 1800);
    });

    return artigo;
}

// atualiza o contador e mostra a mensagem de vazio se precisar
function atualizarEstadoVazio() {
    const quantidade = gradeFavoritos.querySelectorAll(".card-listagem").length;

    // atualiza o texto da quantidade
    quantidadeFavoritosTitulo.textContent = formatarTextoQuantidade(quantidade);

    // mostra ou esconde a mensagem de lista vazia
    favoritosVazio.classList.toggle("visivel", quantidade === 0);

    // esconde a grade se nao tiver itens
    gradeFavoritos.style.display = quantidade === 0 ? "none" : "grid";
}

// busca e desenha todos os favoritos na tela
function renderizarFavoritos() {
    // limpa a grade antes de desenhar
    gradeFavoritos.innerHTML = "";

    // pega a lista de ids salvos
    const idsFavoritados = FavoritosStore.listar();

    // busca os dados completos de cada produto favoritado
    const produtosFavoritados = idsFavoritados
        .map(function (id) {
            return PRODUTOS.find(function (produto) {
                return produto.id === id;
            });
        })
        .filter(Boolean);

    // agrupa os cards antes de colocar no html
    const fragmento = document.createDocumentFragment();

    produtosFavoritados.forEach(function (produto) {
        fragmento.appendChild(criarCardFavorito(produto));
    });

    // joga os cards na tela de uma vez
    gradeFavoritos.appendChild(fragmento);

    // atualiza o contador e tela vazia
    atualizarEstadoVazio();
}

// executa a renderização assim que o script carrega
renderizarFavoritos();