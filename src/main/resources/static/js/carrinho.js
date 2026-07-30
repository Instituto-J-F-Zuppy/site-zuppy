const itensCarrinhoContainer = document.getElementById("itensCarrinho");
const quantidadeItensTitulo = document.getElementById("quantidadeItensTitulo");
const textoProdutos = document.getElementById("textoProdutos");
const valorProdutos = document.getElementById("valorProdutos");
const valorAntigoResumo = document.getElementById("valorAntigoResumo");
const valorTotal = document.getElementById("valorTotal");
const carrinhoVazio = document.getElementById("carrinhoVazio");
const selecionarTodos = document.getElementById("selecionarTodos");
const abrirCupom = document.getElementById("abrirCupom");
const campoCupom = document.getElementById("campoCupom");
const codigoCupom = document.getElementById("codigoCupom");
const aplicarCupom = document.getElementById("aplicarCupom");
const mensagemCupom = document.getElementById("mensagemCupom");
const botaoProximo = document.getElementById("botaoProximo");

let descontoCupom = 0;

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function criarItemCarrinho(item) {
    const article = document.createElement("article");
    article.className = "item-carrinho";
    article.dataset.id = item.id;
    article.dataset.preco = item.preco;
    article.dataset.nome = item.nome;
    article.dataset.imagem = item.imagem;

    article.innerHTML = `
        <label class="selecao-item">
            <input type="checkbox" class="checkbox-item" checked>
            <span class="checkbox-carrinho"></span>
        </label>
        <a href="produto.html" class="imagem-item-carrinho">
            <img src="${item.imagem}" alt="${item.nome}">
        </a>
        <div class="info-item-carrinho">
            <a href="produto.html">${item.nome}</a>
            <span class="tag-item-carrinho">Só no Zuppy!</span>
        </div>
        <div class="acoes-item-carrinho">
            <div class="quantidade-item">
                <button type="button" class="diminuir-quantidade" aria-label="Diminuir quantidade">−</button>
                <span class="numero-quantidade">${item.quantidade}</span>
                <button type="button" class="aumentar-quantidade" aria-label="Aumentar quantidade">+</button>
            </div>
            <button type="button" class="remover-item">Remover</button>
        </div>
        <div class="preco-item-carrinho">
            <div class="preco-antigo-carrinho">
                <span>${formatarMoeda(item.preco * 2)}</span>
                <strong>50% OFF</strong>
            </div>
            <p>${formatarMoeda(item.preco)}</p>
        </div>
    `;

    const diminuir = article.querySelector(".diminuir-quantidade");
    const aumentar = article.querySelector(".aumentar-quantidade");
    const numeroQuantidade = article.querySelector(".numero-quantidade");
    const remover = article.querySelector(".remover-item");
    const checkbox = article.querySelector(".checkbox-item");

    diminuir.addEventListener("click", function () {
        const id = Number(article.dataset.id);
        CarrinhoStore.diminuir(id);
        const itemAtual = CarrinhoStore.listar().find(function (i) {
            return i.id === id;
        });
        if (!itemAtual) {
            article.classList.add("item-removendo");
            setTimeout(function () {
                article.remove();
                atualizarCarrinho();
            }, 200);
            return;
        }
        numeroQuantidade.textContent = itemAtual.quantidade;
        atualizarCarrinho();
    });

    aumentar.addEventListener("click", function () {
        const id = Number(article.dataset.id);
        CarrinhoStore.adicionar(id);
        const itemAtual = CarrinhoStore.listar().find(function (i) {
            return i.id === id;
        });
        if(itemAtual){
            numeroQuantidade.textContent = itemAtual.quantidade;
        }
        atualizarCarrinho();
    });

    remover.addEventListener("click", function () {
        const id = Number(article.dataset.id);
        CarrinhoStore.remover(id);
        article.classList.add("item-removendo");
        setTimeout(function () {
            article.remove();
            atualizarCarrinho();
        }, 200);
    });

    checkbox.addEventListener("change", atualizarCarrinho);

    return article;
}

function obterItens() {
    return Array.from(document.querySelectorAll(".item-carrinho"));
}

function atualizarCarrinho() {
    const itens = obterItens();

    let quantidadeTotal = 0;
    let quantidadeSelecionada = 0;
    let subtotal = 0;

    itens.forEach(function (item) {
        const checkbox = item.querySelector(".checkbox-item");
        const quantidade = Number(item.querySelector(".numero-quantidade").textContent);
        const preco = Number(item.dataset.preco);

        quantidadeTotal += quantidade;

        if (checkbox.checked) {
            quantidadeSelecionada += quantidade;
            subtotal += preco * quantidade;
        }
    });

    const totalComDesconto = Math.max(subtotal - descontoCupom, 0);

    quantidadeItensTitulo.textContent =
        `${quantidadeTotal} ${quantidadeTotal === 1 ? "item" : "itens"}`;

    textoProdutos.textContent = `Produtos (${quantidadeSelecionada})`;
    valorProdutos.textContent = formatarMoeda(subtotal);
    valorAntigoResumo.textContent = formatarMoeda(subtotal * 1.14);
    valorTotal.textContent = formatarMoeda(totalComDesconto);

    selecionarTodos.checked =
        itens.length > 0 &&
        itens.every(function (item) {
            return item.querySelector(".checkbox-item").checked;
        });

    const temItens = itens.length > 0;
    carrinhoVazio.classList.toggle("visivel", !temItens);
    selecionarTodos.closest(".selecionar-todos").style.display = temItens ? "flex" : "none";

    botaoProximo.disabled = !temItens || quantidadeSelecionada === 0;
    botaoProximo.style.opacity = botaoProximo.disabled ? "0.5" : "1";
}

function renderizarCarrinho() {
    const itens = CarrinhoStore.listar();
    itensCarrinhoContainer.innerHTML = "";

    itens.forEach(function (item) {
        itensCarrinhoContainer.appendChild(criarItemCarrinho(item));
    });

    atualizarCarrinho();
}

selecionarTodos.addEventListener("change", function () {
    obterItens().forEach(function (item) {
        item.querySelector(".checkbox-item").checked = selecionarTodos.checked;
    });
    atualizarCarrinho();
});

abrirCupom.addEventListener("click", function () {
    campoCupom.classList.toggle("visivel");
    if (campoCupom.classList.contains("visivel")) {
        codigoCupom.focus();
    }
});

aplicarCupom.addEventListener("click", function () {
    const cupom = codigoCupom.value.trim().toUpperCase();

    if (cupom === "ZUPPY10") {
        descontoCupom = 10;
        mensagemCupom.textContent = "Cupom aplicado: R$10,00 de desconto.";
        mensagemCupom.style.color = "var(--cor-verde-sucesso)";
    } else {
        descontoCupom = 0;
        mensagemCupom.textContent = "Cupom inválido.";
        mensagemCupom.style.color = "var(--cor-vermelho-erro1)";
    }
    atualizarCarrinho();
});

botaoProximo.addEventListener("click", function () {
    if (botaoProximo.disabled) return;
    window.location.href = "checkout.html";
});

const searchInputCarrinho = document.getElementById("searchInput");
if (searchInputCarrinho) {
    searchInputCarrinho.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            const termo = searchInputCarrinho.value.trim();
            if (termo) {
                window.location.href = "todos-produtos.html?q=" + encodeURIComponent(termo);
            }
        }
    });
}

renderizarCarrinho();