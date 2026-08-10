const CHAVE_CHECKOUT_SELECIONADOS = "zuppyCheckoutSelecionados";

function formatarMoedaCheckout(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function somenteNumeros(valor) {
    return valor.replace(/\D/g, "");
}

function aplicarMascaraCep(valor) {
    const numeros = somenteNumeros(valor).slice(0, 8);

    if (numeros.length <= 5) {
        return numeros;
    }

    return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
}

function aplicarMascaraNumeroCartao(valor) {
    const numeros = somenteNumeros(valor).slice(0, 16);
    const grupos = numeros.match(/.{1,4}/g);

    return grupos ? grupos.join(" ") : "";
}

function aplicarMascaraValidade(valor) {
    const numeros = somenteNumeros(valor).slice(0, 4);

    if (numeros.length <= 2) {
        return numeros;
    }

    return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
}

function obterItensCheckout() {
    const todosItens = CarrinhoStore.listar();

    let idsSelecionados = null;

    try {
        idsSelecionados = JSON.parse(
            sessionStorage.getItem(CHAVE_CHECKOUT_SELECIONADOS) || "null"
        );
    } catch {
        idsSelecionados = null;
    }

    if (
        !Array.isArray(idsSelecionados) ||
        idsSelecionados.length === 0
    ) {
        return todosItens;
    }

    const itensFiltrados = todosItens.filter(function (item) {
        return idsSelecionados.includes(item.id);
    });

    return itensFiltrados.length > 0
        ? itensFiltrados
        : todosItens;
}

const conteudoCheckout = document.getElementById("conteudoCheckout");
const checkoutCarrinhoVazio = document.getElementById("checkoutCarrinhoVazio");
const checkoutRequerLogin = document.getElementById("checkoutRequerLogin");
const checkoutErro = document.getElementById("checkoutErro");
const itensResumoCheckout = document.getElementById("itensResumoCheckout");
const subtotalCheckout = document.getElementById("subtotalCheckout");
const totalCheckout = document.getElementById("totalCheckout");

const itensCheckout = obterItensCheckout();
const tokenUsuario = localStorage.getItem("zuppyToken");

if (!tokenUsuario) {
    conteudoCheckout.style.display = "none";
    checkoutRequerLogin.style.display = "block";
} else if (itensCheckout.length === 0) {
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

        const quantidadeEPreco = document.createElement("span");
        quantidadeEPreco.className = "qtd-item-resumo";
        quantidadeEPreco.textContent =
            `${item.quantidade}x ${formatarMoedaCheckout(item.preco)}`;

        linha.appendChild(nome);
        linha.appendChild(quantidadeEPreco);
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

    const cep = document.getElementById("cep");
    const uf = document.getElementById("uf");
    const nomeCartao = document.getElementById("nomeCartao");
    const numeroCartao = document.getElementById("numeroCartao");
    const validadeCartao = document.getElementById("validadeCartao");
    const cvvCartao = document.getElementById("cvvCartao");

    const radiosPagamento = formCheckout.querySelectorAll(
        'input[name="formaPagamento"]'
    );

    function mostrarErroCheckout(campo, elementoErro, mensagem) {
        campo.closest(".campo-grupo").classList.add("campo-invalido");
        elementoErro.textContent = mensagem;
    }

    function removerErroCheckout(campo, elementoErro) {
        campo.closest(".campo-grupo").classList.remove("campo-invalido");
        elementoErro.textContent = "";
    }

    function validarValidade(valor) {
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(valor);
    }

    const camposObrigatorios = {
        nomeCompleto: {
            erro: "erroNomeCompleto",
            mensagem: "Informe seu nome completo."
        },
        endereco: {
            erro: "erroEndereco",
            mensagem: "Informe o endereço."
        },
        cep: {
            erro: "erroCep",
            mensagem: "Informe um CEP válido.",
            validar: function (valor) {
                return somenteNumeros(valor).length === 8;
            }
        },
        numero: {
            erro: "erroNumero",
            mensagem: "Informe o número."
        },
        bairro: {
            erro: "erroBairro",
            mensagem: "Informe o bairro."
        },
        cidade: {
            erro: "erroCidade",
            mensagem: "Informe a cidade."
        },
        uf: {
            erro: "erroUf",
            mensagem: "Informe a UF (2 letras).",
            validar: function (valor) {
                return /^[A-Za-z]{2}$/.test(valor);
            }
        }
    };

    const camposCartaoObrigatorios = {
        nomeCartao: {
            erro: "erroNomeCartao",
            mensagem: "Informe o nome do titular."
        },
        numeroCartao: {
            erro: "erroNumeroCartao",
            mensagem: "Informe os 16 números do cartão.",
            validar: function (valor) {
                return somenteNumeros(valor).length === 16;
            }
        },
        validadeCartao: {
            erro: "erroValidadeCartao",
            mensagem: "Informe uma validade no formato MM/AA.",
            validar: validarValidade
        },
        cvvCartao: {
            erro: "erroCvvCartao",
            mensagem: "O CVV deve possuir 3 números.",
            validar: function (valor) {
                return /^\d{3}$/.test(valor);
            }
        }
    };

    cep.addEventListener("input", function () {
        cep.value = aplicarMascaraCep(cep.value);
    });

    numeroCartao.addEventListener("input", function () {
        numeroCartao.value = aplicarMascaraNumeroCartao(
            numeroCartao.value
        );
    });

    validadeCartao.addEventListener("input", function () {
        validadeCartao.value = aplicarMascaraValidade(
            validadeCartao.value
        );
    });

    cvvCartao.addEventListener("input", function () {
        cvvCartao.value = somenteNumeros(
            cvvCartao.value
        ).slice(0, 3);
    });

    nomeCartao.addEventListener("input", function () {
        nomeCartao.value = nomeCartao.value.toLocaleUpperCase("pt-BR");
    });

    uf.addEventListener("input", function () {
        uf.value = uf.value
            .replace(/[^A-Za-z]/g, "")
            .slice(0, 2)
            .toUpperCase();
    });

    Object.keys(camposObrigatorios).forEach(function (id) {
        const campo = document.getElementById(id);
        const configuracao = camposObrigatorios[id];
        const elementoErro = document.getElementById(
            configuracao.erro
        );

        campo.addEventListener("input", function () {
            removerErroCheckout(
                campo,
                elementoErro
            );
        });
    });

    Object.keys(camposCartaoObrigatorios).forEach(function (id) {
        const campo = document.getElementById(id);
        const configuracao = camposCartaoObrigatorios[id];
        const elementoErro = document.getElementById(
            configuracao.erro
        );

        campo.addEventListener("input", function () {
            removerErroCheckout(
                campo,
                elementoErro
            );
        });
    });

    function obterFormaPagamentoSelecionada() {
        const radioSelecionado = formCheckout.querySelector(
            'input[name="formaPagamento"]:checked'
        );

        return radioSelecionado
            ? radioSelecionado.value
            : null;
    }

    function atualizarFormaPagamento() {
        const formaSelecionada =
            obterFormaPagamentoSelecionada();

        camposCartao.style.display =
            formaSelecionada === "cartao"
                ? "block"
                : "none";

        avisoPix.style.display =
            formaSelecionada === "pix"
                ? "block"
                : "none";

        avisoBoleto.style.display =
            formaSelecionada === "boleto"
                ? "block"
                : "none";

        if (formaSelecionada !== "cartao") {
            Object.keys(camposCartaoObrigatorios).forEach(function (id) {
                const campo = document.getElementById(id);

                const elementoErro = document.getElementById(
                    camposCartaoObrigatorios[id].erro
                );

                removerErroCheckout(
                    campo,
                    elementoErro
                );
            });
        }
    }

    radiosPagamento.forEach(function (radio) {
        radio.addEventListener(
            "change",
            atualizarFormaPagamento
        );
    });

    atualizarFormaPagamento();

    function validarCampos(definicoes) {
        let valido = true;

        Object.keys(definicoes).forEach(function (id) {
            const campo = document.getElementById(id);
            const configuracao = definicoes[id];
            const elementoErro = document.getElementById(
                configuracao.erro
            );

            const valor = campo.value.trim();

            removerErroCheckout(
                campo,
                elementoErro
            );

            if (valor === "") {
                mostrarErroCheckout(
                    campo,
                    elementoErro,
                    configuracao.mensagem
                );

                valido = false;
            } else if (
                configuracao.validar &&
                !configuracao.validar(valor)
            ) {
                mostrarErroCheckout(
                    campo,
                    elementoErro,
                    configuracao.mensagem
                );

                valido = false;
            }
        });

        return valido;
    }

    formCheckout.addEventListener(
        "submit",
        function (evento) {
            evento.preventDefault();

            const enderecoValido =
                validarCampos(
                    camposObrigatorios
                );

            const formaSelecionada =
                obterFormaPagamentoSelecionada();

            const pagamentoValido =
                formaSelecionada === "cartao"
                    ? validarCampos(
                        camposCartaoObrigatorios
                    )
                    : true;

            if (
                !enderecoValido ||
                !pagamentoValido ||
                !formaSelecionada
            ) {
                const primeiroCampoInvalido =
                    formCheckout.querySelector(
                        ".campo-invalido input"
                    );

                primeiroCampoInvalido?.focus();

                return;
            }

            const botaoConfirmar =
                document.getElementById(
                    "botaoConfirmarPedido"
                );

            const textoOriginal =
                botaoConfirmar.textContent;

            botaoConfirmar.disabled = true;
            botaoConfirmar.textContent =
                "Confirmando...";

            checkoutErro.style.display =
                "none";

            checkoutErro.textContent =
                "";

            const corpoPedido = {
                cep: somenteNumeros(
                    cep.value
                ),
                numero: document
                    .getElementById("numero")
                    .value
                    .trim(),
                endereco: document
                    .getElementById("endereco")
                    .value
                    .trim(),
                complemento: document
                    .getElementById("complemento")
                    .value
                    .trim(),
                bairro: document
                    .getElementById("bairro")
                    .value
                    .trim(),
                cidade: document
                    .getElementById("cidade")
                    .value
                    .trim(),
                uf: uf.value
                    .trim()
                    .toUpperCase(),
                formaPagamento:
                    formaSelecionada,
                itens: itensCheckout.map(
                    function (item) {
                        const produto =
                            PRODUTOS.find(
                                function (produtoAtual) {
                                    return (
                                        produtoAtual.id ===
                                        item.id
                                    );
                                }
                            );

                        return {
                            brinquedoId:
                                produto
                                    ? produto.brinquedoId
                                    : null,
                            quantidade:
                                item.quantidade
                        };
                    }
                )
            };

            fetch("/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                    "Authorization":
                        `Bearer ${tokenUsuario}`
                },
                body: JSON.stringify(
                    corpoPedido
                )
            })
                .then(
                    async function (resposta) {
                        const dados =
                            await resposta
                                .json()
                                .catch(
                                    function () {
                                        return null;
                                    }
                                );

                        if (!resposta.ok) {
                            const mensagem =
                                dados &&
                                dados.erro
                                    ? dados.erro
                                    : "Não foi possível confirmar o pedido. Tente novamente.";

                            throw new Error(
                                mensagem
                            );
                        }

                        itensCheckout.forEach(
                            function (item) {
                                CarrinhoStore.remover(
                                    item.id
                                );
                            }
                        );

                        sessionStorage.removeItem(
                            CHAVE_CHECKOUT_SELECIONADOS
                        );

                        conteudoCheckout.style.display =
                            "none";

                        numeroPedido.textContent =
                            dados.numero;

                        confirmacaoPedido.style.display =
                            "block";

                        confirmacaoPedido.focus?.();
                    }
                )
                .catch(
                    function (erro) {
                        checkoutErro.textContent =
                            erro.message;

                        checkoutErro.style.display =
                            "block";
                    }
                )
                .finally(
                    function () {
                        botaoConfirmar.disabled = false;

                        botaoConfirmar.textContent = textoOriginal;
                    }
                );
        }
    );
}