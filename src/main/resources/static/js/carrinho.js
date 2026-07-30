const selecionarTodos = document.getElementById("selecionarTodos");
const itensCarrinhoContainer = document.getElementById("itensCarrinho");
const quantidadeItensTitulo = document.getElementById("quantidadeItensTitulo");
const textoProdutos = document.getElementById("textoProdutos");
const valorProdutos = document.getElementById("valorProdutos");
const valorAntigoResumo = document.getElementById("valorAntigoResumo");
const valorTotal = document.getElementById("valorTotal");
const carrinhoVazio = document.getElementById("carrinhoVazio");
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

function obterItens() {
    return Array.from(
        document.querySelectorAll(".item-carrinho")
    );
}

function atualizarCarrinho() {
    const itens = obterItens();

    let quantidadeTotal = 0;
    let quantidadeSelecionada = 0;
    let subtotal = 0;

    itens.forEach(function (item) {
        const checkbox = item.querySelector(".checkbox-item");
        const quantidade = Number(
            item.querySelector(".numero-quantidade").textContent
        );
        const preco = Number(item.dataset.preco);

        quantidadeTotal += quantidade;

        if (checkbox.checked) {
            quantidadeSelecionada += quantidade;
            subtotal += preco * quantidade;
        }
    });

    const totalComDesconto = Math.max(
        subtotal - descontoCupom,
        0
    );

    quantidadeItensTitulo.textContent =
        `${quantidadeTotal} ${quantidadeTotal === 1 ? "item" : "itens"}`;

    textoProdutos.textContent =
        `Produtos (${quantidadeSelecionada})`;

    valorProdutos.textContent =
        formatarMoeda(subtotal);

    valorAntigoResumo.textContent =
        formatarMoeda(subtotal * 1.14);

    valorTotal.textContent =
        formatarMoeda(totalComDesconto);

    selecionarTodos.checked =
        itens.length > 0 &&
        itens.every(function (item) {
            return item.querySelector(".checkbox-item").checked;
        });

    carrinhoVazio.classList.toggle(
        "visivel",
        itens.length === 0
    );

    selecionarTodos.closest(".selecionar-todos").style.display =
        itens.length === 0 ? "none" : "flex";

    botaoProximo.disabled =
        itens.length === 0 || quantidadeSelecionada === 0;

    botaoProximo.style.opacity =
        botaoProximo.disabled ? "0.5" : "1";
}

function configurarItem(item) {
    const diminuir = item.querySelector(".diminuir-quantidade");
    const aumentar = item.querySelector(".aumentar-quantidade");
    const numeroQuantidade = item.querySelector(".numero-quantidade");
    const remover = item.querySelector(".remover-item");
    const checkbox = item.querySelector(".checkbox-item");

    diminuir.addEventListener("click", function () {
        let quantidade = Number(numeroQuantidade.textContent);

        if (quantidade > 1) {
            quantidade--;
            numeroQuantidade.textContent = quantidade;
            atualizarCarrinho();
        }
    });

    aumentar.addEventListener("click", function () {
        let quantidade = Number(numeroQuantidade.textContent);

        quantidade++;
        numeroQuantidade.textContent = quantidade;

        atualizarCarrinho();
    });
    checkbox.addEventListener("change", atualizarCarrinho);
}

obterItens().forEach(configurarItem);

selecionarTodos.addEventListener("change", function () {
    obterItens().forEach(function (item) {
        item.querySelector(".checkbox-item").checked =
            selecionarTodos.checked;
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
        mensagemCupom.textContent =
            "Cupom aplicado: R$10,00 de desconto.";
        mensagemCupom.style.color =
            "var(--cor-verde-sucesso)";
    } else {
        descontoCupom = 0;
        mensagemCupom.textContent =
            "Cupom inválido.";
        mensagemCupom.style.color =
            "var(--cor-vermelho-erro1)";
    }

    atualizarCarrinho();
});

botaoProximo.addEventListener("click", function () {
    if (botaoProximo.disabled) {
        return;
    }

    window.location.href = "checkout.html";
});

atualizarCarrinho();