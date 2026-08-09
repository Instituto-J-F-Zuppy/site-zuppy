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
const itensSelecionados = new Set();

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterProdutoInfo(id) {
    return PRODUTOS.find(function (produto) {
        return produto.id === id;
    });
}

function criarItemCarrinho(item) {
    const info = obterProdutoInfo(item.id);

    const artigo = document.createElement("article");
    artigo.className = "item-carrinho";
    artigo.dataset.id = item.id;
    artigo.dataset.preco = String(item.preco);

    const label = document.createElement("label");
    label.className = "selecao-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox-item";
    checkbox.checked = itensSelecionados.has(item.id);
    label.appendChild(checkbox);
    const checkboxVisual = document.createElement("span");
    checkboxVisual.className = "checkbox-carrinho";
    label.appendChild(checkboxVisual);
    artigo.appendChild(label);

    const linkImagem = document.createElement("a");
    linkImagem.className = "imagem-item-carrinho";
    linkImagem.href = `produto.html?id=${encodeURIComponent(item.id)}`;
    const imagem = document.createElement("img");
    imagem.src = item.imagem;
    imagem.alt = item.nome;
    imagem.loading = "lazy";
    linkImagem.appendChild(imagem);
    artigo.appendChild(linkImagem);

    const infoItem = document.createElement("div");
    infoItem.className = "info-item-carrinho";
    const linkNome = document.createElement("a");
    linkNome.href = `produto.html?id=${encodeURIComponent(item.id)}`;
    linkNome.textContent = item.nome;
    infoItem.appendChild(linkNome);
    const tag = document.createElement("span");
    tag.className = "tag-item-carrinho";
    tag.textContent = "Só no Zuppy!";
    infoItem.appendChild(tag);
    artigo.appendChild(infoItem);

    const acoesItem = document.createElement("div");
    acoesItem.className = "acoes-item-carrinho";

    const quantidadeItem = document.createElement("div");
    quantidadeItem.className = "quantidade-item";

    const diminuir = document.createElement("button");
    diminuir.type = "button";
    diminuir.className = "diminuir-quantidade";
    diminuir.setAttribute("aria-label", "Diminuir quantidade");
    diminuir.textContent = "−";
    diminuir.addEventListener("click", function () {
        CarrinhoStore.diminuir(item.id);
    });
    quantidadeItem.appendChild(diminuir);

    const numeroQuantidade = document.createElement("span");
    numeroQuantidade.className = "numero-quantidade";
    numeroQuantidade.textContent = String(item.quantidade);
    quantidadeItem.appendChild(numeroQuantidade);

    const aumentar = document.createElement("button");
    aumentar.type = "button";
    aumentar.className = "aumentar-quantidade";
    aumentar.setAttribute("aria-label", "Aumentar quantidade");
    aumentar.textContent = "+";
    aumentar.addEventListener("click", function () {
        CarrinhoStore.aumentar(item.id);
    });
    quantidadeItem.appendChild(aumentar);

    acoesItem.appendChild(quantidadeItem);

    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "remover-item";
    remover.textContent = "Remover";
    remover.addEventListener("click", function () {
        itensSelecionados.delete(item.id);
        CarrinhoStore.remover(item.id);
    });
    acoesItem.appendChild(remover);

    artigo.appendChild(acoesItem);

    const precoItem = document.createElement("div");
    precoItem.className = "preco-item-carrinho";

    if (info) {
        const precoAntigoArea = document.createElement("div");
        precoAntigoArea.className = "preco-antigo-carrinho";
        const precoAntigoSpan = document.createElement("span");
        precoAntigoSpan.textContent = info.precoAntigoTexto;
        const descontoStrong = document.createElement("strong");
        descontoStrong.textContent = info.descontoTexto;
        precoAntigoArea.appendChild(precoAntigoSpan);
        precoAntigoArea.appendChild(descontoStrong);
        precoItem.appendChild(precoAntigoArea);
    }

    const precoTexto = document.createElement("p");
    precoTexto.textContent = formatarMoeda(item.preco * item.quantidade);
    precoItem.appendChild(precoTexto);

    artigo.appendChild(precoItem);

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            itensSelecionados.add(item.id);
        } else {
            itensSelecionados.delete(item.id);
        }
        atualizarResumo();
    });

    return artigo;
}

function renderizarItens() {
    const itens = CarrinhoStore.listar();
    const idsAtuais = new Set(itens.map(function (item) { return item.id; }));

    itensSelecionados.forEach(function (id) {
        if (!idsAtuais.has(id)) {
            itensSelecionados.delete(id);
        }
    });

    itens.forEach(function (item) {
        if (!itensSelecionados.has(item.id)) {
            itensSelecionados.add(item.id);
        }
    });

    itensCarrinhoContainer.innerHTML = "";

    const fragmento = document.createDocumentFragment();
    itens.forEach(function (item) {
        fragmento.appendChild(criarItemCarrinho(item));
    });
    itensCarrinhoContainer.appendChild(fragmento);
}

function atualizarResumo() {
    const itens = CarrinhoStore.listar();

    let quantidadeTotal = 0;
    let quantidadeSelecionada = 0;
    let subtotal = 0;

    itens.forEach(function (item) {
        quantidadeTotal += item.quantidade;

        if (itensSelecionados.has(item.id)) {
            quantidadeSelecionada += item.quantidade;
            subtotal += item.preco * item.quantidade;
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
            return itensSelecionados.has(item.id);
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

function atualizarCarrinho() {
    renderizarItens();
    atualizarResumo();
}

selecionarTodos.addEventListener("change", function () {
    const itens = CarrinhoStore.listar();

    if (selecionarTodos.checked) {
        itens.forEach(function (item) {
            itensSelecionados.add(item.id);
        });
    } else {
        itensSelecionados.clear();
    }

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

    atualizarResumo();
});

botaoProximo.addEventListener("click", function () {
    if (botaoProximo.disabled) {
        return;
    }

    sessionStorage.setItem(
        "zuppyCheckoutSelecionados",
        JSON.stringify(Array.from(itensSelecionados))
    );

    window.location.href = "checkout.html";
});

window.addEventListener("carrinho-atualizado", atualizarCarrinho);

atualizarCarrinho();
