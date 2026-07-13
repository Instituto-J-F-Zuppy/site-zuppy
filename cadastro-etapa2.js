const formCadastroEtapa2 = document.getElementById("formCadastroEtapa2");

const campoSenha = document.getElementById("senha");
const campoConfirmarSenha = document.getElementById("confirmarSenha");

const erroSenha = document.getElementById("erroSenha");
const erroConfirmarSenha = document.getElementById("erroConfirmarSenha");

const mostrarSenha = document.getElementById("mostrarSenha");
const mostrarConfirmarSenha = document.getElementById("mostrarConfirmarSenha");

const requisitoTamanho = document.getElementById("requisitoTamanho");
const requisitoLetras = document.getElementById("requisitoLetras");
const requisitoNumero = document.getElementById("requisitoNumero");
const requisitoEspecial = document.getElementById("requisitoEspecial");

function mostrarErro(campo, elementoErro, mensagem) {
    campo.closest(".campo-grupo").classList.add("campo-invalido");
    elementoErro.textContent = mensagem;
}

function removerErro(campo, elementoErro) {
    campo.closest(".campo-grupo").classList.remove("campo-invalido");
    elementoErro.textContent = "";
}

function alternarVisibilidade(campo, botao) {
    const senhaVisivel = campo.type === "text";

    campo.type = senhaVisivel ? "password" : "text";

    botao.setAttribute(
        "aria-label",
        senhaVisivel ? "Mostrar senha" : "Ocultar senha"
    );
}

function validarRequisito(elemento, valido) {
    elemento.classList.toggle("requisito-valido", valido);
    elemento.classList.toggle("requisito-invalido", !valido);
}

function obterValidacaoSenha(senha) {
    return {
        tamanho: senha.length >= 8,
        letras: /[a-z]/.test(senha) && /[A-Z]/.test(senha),
        numero: /\d/.test(senha),
        especial: /[^A-Za-z0-9]/.test(senha)
    };
}

function senhaValida(senha) {
    const validacao = obterValidacaoSenha(senha);

    return (
        validacao.tamanho &&
        validacao.letras &&
        validacao.numero &&
        validacao.especial
    );
}

function atualizarRequisitos() {
    const senha = campoSenha.value;
    const validacao = obterValidacaoSenha(senha);

    if (senha === "") {
        requisitoTamanho.classList.remove(
            "requisito-valido",
            "requisito-invalido"
        );

        requisitoLetras.classList.remove(
            "requisito-valido",
            "requisito-invalido"
        );

        requisitoNumero.classList.remove(
            "requisito-valido",
            "requisito-invalido"
        );

        requisitoEspecial.classList.remove(
            "requisito-valido",
            "requisito-invalido"
        );

        return;
    }

    validarRequisito(requisitoTamanho, validacao.tamanho);
    validarRequisito(requisitoLetras, validacao.letras);
    validarRequisito(requisitoNumero, validacao.numero);
    validarRequisito(requisitoEspecial, validacao.especial);
}

mostrarSenha.addEventListener("click", function () {
    alternarVisibilidade(campoSenha, mostrarSenha);
});

mostrarConfirmarSenha.addEventListener("click", function () {
    alternarVisibilidade(
        campoConfirmarSenha,
        mostrarConfirmarSenha
    );
});

campoSenha.addEventListener("input", function () {
    removerErro(campoSenha, erroSenha);
    atualizarRequisitos();

    if (campoConfirmarSenha.value !== "") {
        removerErro(
            campoConfirmarSenha,
            erroConfirmarSenha
        );
    }
});

campoConfirmarSenha.addEventListener("input", function () {
    removerErro(
        campoConfirmarSenha,
        erroConfirmarSenha
    );
});

formCadastroEtapa2.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const senha = campoSenha.value;
    const confirmarSenha = campoConfirmarSenha.value;

    let formularioValido = true;

    removerErro(campoSenha, erroSenha);

    removerErro(
        campoConfirmarSenha,
        erroConfirmarSenha
    );

    if (senha === "") {
        mostrarErro(
            campoSenha,
            erroSenha,
            "Informe uma senha."
        );

        formularioValido = false;
    } else if (!senhaValida(senha)) {
        mostrarErro(
            campoSenha,
            erroSenha,
            "A senha não atende a todos os requisitos."
        );

        formularioValido = false;
    }

    if (confirmarSenha === "") {
        mostrarErro(
            campoConfirmarSenha,
            erroConfirmarSenha,
            "Confirme sua senha."
        );

        formularioValido = false;
    } else if (senha !== confirmarSenha) {
        mostrarErro(
            campoConfirmarSenha,
            erroConfirmarSenha,
            "As senhas não são iguais."
        );

        formularioValido = false;
    }

    if (!formularioValido) {
        const primeiroCampoInvalido = document.querySelector(
            ".campo-invalido input"
        );

        primeiroCampoInvalido?.focus();

        return;
    }

    const dadosPrimeiraEtapa = JSON.parse(
        sessionStorage.getItem("cadastroZuppy") || "{}"
    );

    const cadastroCompleto = {
        ...dadosPrimeiraEtapa,
        senha: senha
    };

    console.log("Cadastro completo:", cadastroCompleto);

    sessionStorage.removeItem("cadastroZuppy");

    alert("Cadastro realizado com sucesso!");

    window.location.href = "login.html";
});