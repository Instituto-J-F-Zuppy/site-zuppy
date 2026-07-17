const formCadastro = document.getElementById("formCadastro");

const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoTelefone = document.getElementById("telefone");
const campoCpfCnpj = document.getElementById("cpfCnpj");

const erroNome = document.getElementById("erroNome");
const erroEmail = document.getElementById("erroEmail");
const erroTelefone = document.getElementById("erroTelefone");
const erroCpfCnpj = document.getElementById("erroCpfCnpj");

function mostrarErro(campo, elementoErro, mensagem) {
    campo.closest(".campo-grupo").classList.add("campo-invalido");
    elementoErro.textContent = mensagem;
}

function removerErro(campo, elementoErro) {
    campo.closest(".campo-grupo").classList.remove("campo-invalido");
    elementoErro.textContent = "";
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function telefoneValido(telefone) {
    const numeros = telefone.replace(/\D/g, "");
    return numeros.length === 10 || numeros.length === 11;
}

function cpfCnpjValido(valor) {
    const numeros = valor.replace(/\D/g, "");
    return numeros.length === 11 || numeros.length === 14;
}

function formatarCpfCnpj(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 14);

    if (numeros.length <= 11) {
        return numeros
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return numeros
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) {
        return numeros;
    }

    if (numeros.length <= 6) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    if (numeros.length <= 10) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

campoTelefone.addEventListener("input", function () {
    campoTelefone.value = formatarTelefone(campoTelefone.value);
    removerErro(campoTelefone, erroTelefone);
});

campoCpfCnpj.addEventListener("input", function () {
    campoCpfCnpj.value = formatarCpfCnpj(campoCpfCnpj.value);
    removerErro(campoCpfCnpj, erroCpfCnpj);
});

campoNome.addEventListener("input", function () {
    removerErro(campoNome, erroNome);
});

campoEmail.addEventListener("input", function () {
    removerErro(campoEmail, erroEmail);
});

formCadastro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();
    const telefone = campoTelefone.value.trim();
    const cpfCnpj = campoCpfCnpj.value.trim();

    let formularioValido = true;

    removerErro(campoNome, erroNome);
    removerErro(campoEmail, erroEmail);
    removerErro(campoTelefone, erroTelefone);
    removerErro(campoCpfCnpj, erroCpfCnpj);

    if (nome === "") {
        mostrarErro(
            campoNome,
            erroNome,
            "Informe seu nome completo."
        );

        formularioValido = false;
    } else if (nome.length < 3) {
        mostrarErro(
            campoNome,
            erroNome,
            "Digite um nome válido."
        );

        formularioValido = false;
    } else if (!nome.includes(" ")) {
        mostrarErro(
            campoNome,
            erroNome,
            "Informe também o seu sobrenome."
        );

        formularioValido = false;
    }

    if (email === "") {
        mostrarErro(
            campoEmail,
            erroEmail,
            "Informe seu e-mail."
        );

        formularioValido = false;
    } else if (!emailValido(email)) {
        mostrarErro(
            campoEmail,
            erroEmail,
            "Digite um e-mail válido."
        );

        formularioValido = false;
    }

    if (telefone === "") {
        mostrarErro(
            campoTelefone,
            erroTelefone,
            "Informe seu telefone."
        );

        formularioValido = false;
    } else if (!telefoneValido(telefone)) {
        mostrarErro(
            campoTelefone,
            erroTelefone,
            "Digite um telefone válido com DDD."
        );

        formularioValido = false;
    }

    if (cpfCnpj === "") {
        mostrarErro(
            campoCpfCnpj,
            erroCpfCnpj,
            "Informe seu CPF ou CNPJ."
        );

        formularioValido = false;
    } else if (!cpfCnpjValido(cpfCnpj)) {
        mostrarErro(
            campoCpfCnpj,
            erroCpfCnpj,
            "Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido."
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

    sessionStorage.setItem(
        "cadastroZuppy",
        JSON.stringify({
            nome: nome,
            email: email,
            telefone: telefone,
            cpfCnpj: cpfCnpj
        })
    );

    window.location.href = "cadastro-etapa2.html";
});