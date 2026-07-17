const formLogin = document.getElementById("formLogin");

const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");

const erroEmail = document.getElementById("erroEmail");
const erroSenha = document.getElementById("erroSenha");

const mostrarSenha = document.getElementById("mostrarSenha");

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

mostrarSenha.addEventListener("click", function () {
    const senhaVisivel = campoSenha.type === "text";

    campoSenha.type = senhaVisivel ? "password" : "text";

    mostrarSenha.setAttribute(
        "aria-label",
        senhaVisivel ? "Mostrar senha" : "Ocultar senha"
    );
});

campoEmail.addEventListener("input", function () {
    removerErro(campoEmail, erroEmail);
});

campoSenha.addEventListener("input", function () {
    removerErro(campoSenha, erroSenha);
});

formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const email = campoEmail.value.trim();
    const senha = campoSenha.value;

    let formularioValido = true;

    removerErro(campoEmail, erroEmail);
    removerErro(campoSenha, erroSenha);

    if (email === "") {
        mostrarErro(campoEmail, erroEmail, "Informe seu e-mail.");
        formularioValido = false;
    } else if (!emailValido(email)) {
        mostrarErro(campoEmail, erroEmail, "Digite um e-mail válido.");
        formularioValido = false;
    }

    if (senha === "") {
        mostrarErro(campoSenha, erroSenha, "Informe sua senha.");
        formularioValido = false;
    }

    if (!formularioValido) {
        const primeiroCampoInvalido = document.querySelector(".campo-invalido input");
        primeiroCampoInvalido?.focus();
        return;
    }

    const botaoSubmit = formLogin.querySelector("button[type='submit']");
    const textoOriginalBotao = botaoSubmit ? botaoSubmit.textContent : "";

    if (botaoSubmit) {
        botaoSubmit.disabled = true;
        botaoSubmit.textContent = "Entrando...";
    }

    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, senha: senha })
    })
        .then(async function (resposta) {
            const dados = await resposta.json().catch(function () {
                return null;
            });

            if (!resposta.ok) {
                const mensagem = dados && dados.erro
                    ? dados.erro
                    : "Não foi possível entrar. Tente novamente.";

                throw new Error(mensagem);
            }

            localStorage.setItem("zuppyToken", dados.token);
            localStorage.setItem("zuppyNome", dados.nome);

            window.location.href = "index.html";
        })
        .catch(function (erro) {
            mostrarErro(campoSenha, erroSenha, erro.message);
        })
        .finally(function () {
            if (botaoSubmit) {
                botaoSubmit.disabled = false;
                botaoSubmit.textContent = textoOriginalBotao;
            }
        });
});