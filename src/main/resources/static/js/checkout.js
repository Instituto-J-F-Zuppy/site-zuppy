const CHAVE_CHECKOUT_SELECIONADOS = "zuppyCheckoutSelecionados";

function formatarMoedaCheckout(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function obterItensCheckout() {
    const todosItens = CarrinhoStore.listar();

    let idsSelecionados = null;
    try {
        idsSelecionados = JSON.parse(sessionStorage.getItem(CHAVE_CHECKOUT_SELECIONADOS) || "null");
    } catch (erro) {
        idsSelecionados = null;
    }

    if (!Array.isArray(idsSelecionados) || idsSelecionados.length === 0) {
        return todosItens;
    }

    const itensFiltrados = todosItens.filter(function (item) {
        return idsSelecionados.includes(item.id);
    });

    return itensFiltrados.length > 0 ? itensFiltrados : todosItens;
}

const conteudoCheckout = document.getElementById("conteudoCheckout");
const checkoutCarrinhoVazio = document.getElementById("checkoutCarrinhoVazio");
const itensResumoCheckout = document.getElementById("itensResumoCheckout");
const subtotalCheckout = document.getElementById("subtotalCheckout");
const totalCheckout = document.getElementById("totalCheckout");

const itensCheckout = obterItensCheckout();

if (itensCheckout.length === 0) {
    conteudoCheckout.style.display = "none";
    checkoutCarrinhoVazio.style.display = "block";
} else {
    let subtotal = 0;
    const fragmento = document.createDocumentFragment();

    itensCheckout.forEach(function (item) {
        const linha = document.createElement("div");
        linha.className = "item-resumo-checkout";

        const nome = document.createElement("span");
        nome.className = "nome-item-resumo";
        nome.textContent = item.nome;

        const qtdEPreco = document.createElement("span");
        qtdEPreco.className = "qtd-item-resumo";
        qtdEPreco.textContent = `${item.quantidade}x ${formatarMoedaCheckout(item.preco)}`;

        linha.appendChild(nome);
        linha.appendChild(qtdEPreco);
        fragmento.appendChild(linha);

        subtotal += item.preco * item.quantidade;
    });

    itensResumoCheckout.appendChild(fragmento);
    subtotalCheckout.textContent = formatarMoedaCheckout(subtotal);
    totalCheckout.textContent = formatarMoedaCheckout(subtotal);

    const formCheckout = document.getElementById("formCheckout");
    const camposCartao = document.getElementById("camposCartao");
    const avisoPix = document.getElementById("avisoPix");
    const avisoBoleto = document.getElementById("avisoBoleto");
    const confirmacaoPedido = document.getElementById("confirmacaoPedido");
    const numeroPedido = document.getElementById("numeroPedido");

    const radiosPagamento = formCheckout.querySelectorAll('input[name="formaPagamento"]');

    function mostrarErroCheckout(campo, elementoErro, mensagem) {
        campo.closest(".campo-grupo").classList.add("campo-invalido");
        elementoErro.textContent = mensagem;
    }

    function removerErroCheckout(campo, elementoErro) {
        campo.closest(".campo-grupo").classList.remove("campo-invalido");
        elementoErro.textContent = "";
    }

    const camposObrigatorios = {
        nomeCompleto: { erro: "erroNomeCompleto", mensagem: "Informe seu nome completo." },
        cep: { erro: "erroCep", mensagem: "Informe um CEP válido.", validar: function (valor) { return /^\d{5}-?\d{3}$/.test(valor); } },
        numero: { erro: "erroNumero", mensagem: "Informe o número." },
        endereco: { erro: "erroEndereco", mensagem: "Informe o endereço." },
        bairro: { erro: "erroBairro", mensagem: "Informe o bairro." },
        cidade: { erro: "erroCidade", mensagem: "Informe a cidade." },
        uf: { erro: "erroUf", mensagem: "Informe a UF (2 letras).", validar: function (valor) { return /^[A-Za-z]{2}$/.test(valor); } }
    };

    const camposCartaoObrigatorios = {
        nomeCartao: { erro: "erroNomeCartao", mensagem: "Informe o nome do titular." },
        numeroCartao: { erro: "erroNumeroCartao", mensagem: "Número de cartão inválido.", validar: function (valor) { return /^\d{13,19}$/.test(valor.replace(/\s/g, "")); } },
        validadeCartao: { erro: "erroValidadeCartao", mensagem: "Use o formato MM/AA.", validar: function (valor) { return /^(0[1-9]|1[0-2])\/\d{2}$/.test(valor); } },
        cvvCartao: { erro: "erroCvvCartao", mensagem: "CVV inválido.", validar: function (valor) { return /^\d{3,4}$/.test(valor); } }
    };

    const nomeCartao = document.getElementById("nomeCartao");
    const numeroCartao = document.getElementById("numeroCartao");
    const validadeCartao = document.getElementById("validadeCartao");
    const cvvCartao = document.getElementById("cvvCartao");

    Object.keys(camposObrigatorios).forEach(function (id) {
        const campo = document.getElementById(id);
        const config = camposObrigatorios[id];
        const elementoErro = document.getElementById(config.erro);

        campo.addEventListener("input", function () {
            removerErroCheckout(campo, elementoErro);
        });
    });

    Object.keys(camposCartaoObrigatorios).forEach(function (id) {
        const campo = document.getElementById(id);
        const config = camposCartaoObrigatorios[id];
        const elementoErro = document.getElementById(config.erro);

        campo.addEventListener("input", function () {
            removerErroCheckout(campo, elementoErro);
        });
    });

    function atualizarFormaPagamento() {
        const formaSelecionada = formCheckout.querySelector('input[name="formaPagamento"]:checked').value;

        camposCartao.style.display = formaSelecionada === "cartao" ? "block" : "none";
        avisoPix.style.display = formaSelecionada === "pix" ? "block" : "none";
        avisoBoleto.style.display = formaSelecionada === "boleto" ? "block" : "none";

        if (formaSelecionada !== "cartao") {
            Object.keys(camposCartaoObrigatorios).forEach(function (id) {
                const campo = document.getElementById(id);
                const elementoErro = document.getElementById(camposCartaoObrigatorios[id].erro);
                removerErroCheckout(campo, elementoErro);
            });
        }
    }

    radiosPagamento.forEach(function (radio) {
        radio.addEventListener("change", atualizarFormaPagamento);
    });

    atualizarFormaPagamento();

    function validarCampos(definicoes) {
        let valido = true;

        Object.keys(definicoes).forEach(function (id) {
            const campo = document.getElementById(id);
            const config = definicoes[id];
            const elementoErro = document.getElementById(config.erro);
            const valor = campo.value.trim();

            removerErroCheckout(campo, elementoErro);

            if (valor === "") {
                mostrarErroCheckout(campo, elementoErro, config.mensagem);
                valido = false;
            } else if (config.validar && !config.validar(valor)) {
                mostrarErroCheckout(campo, elementoErro, config.mensagem);
                valido = false;
            }
        });

        return valido;
    }

    formCheckout.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const enderecoValido = validarCampos(camposObrigatorios);

        const formaSelecionada = formCheckout.querySelector('input[name="formaPagamento"]:checked').value;
        const pagamentoValido = formaSelecionada === "cartao"
            ? validarCampos(camposCartaoObrigatorios)
            : true;

        if (!enderecoValido || !pagamentoValido) {
            const primeiroCampoInvalido = formCheckout.querySelector(".campo-invalido input");
            primeiroCampoInvalido?.focus();
            return;
        }

        const botaoConfirmar = document.getElementById("botaoConfirmarPedido");
        const textoOriginal = botaoConfirmar.textContent;
        botaoConfirmar.disabled = true;
        botaoConfirmar.textContent = "Confirmando...";

        window.setTimeout(function () {
            const numero = `#ZP${Date.now().toString().slice(-8)}`;

            itensCheckout.forEach(function (item) {
                CarrinhoStore.remover(item.id);
            });
            sessionStorage.removeItem(CHAVE_CHECKOUT_SELECIONADOS);

            conteudoCheckout.style.display = "none";
            numeroPedido.textContent = numero;
            confirmacaoPedido.style.display = "block";
            confirmacaoPedido.focus?.();

            botaoConfirmar.disabled = false;
            botaoConfirmar.textContent = textoOriginal;
        }, 600);
    });
}
