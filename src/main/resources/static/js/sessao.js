function exibirUsuarioLogado() {
    const token = localStorage.getItem("zuppyToken");
    const nome = localStorage.getItem("zuppyNome");

    const linkCadastrar = document.getElementById("linkCadastrar");
    const linkEntrar = document.getElementById("linkEntrar");
    const areaUsuarioLogado = document.getElementById("areaUsuarioLogado");
    const saudacaoUsuario = document.getElementById("saudacaoUsuario");
    const botaoSair = document.getElementById("botaoSair");

    if (!token || !nome) {
        return;
    }

    const primeiroNome = nome.trim().split(" ")[0];

    linkCadastrar.style.display = "none";
    linkEntrar.style.display = "none";

    areaUsuarioLogado.style.display = "flex";
    saudacaoUsuario.textContent = `Olá, ${primeiroNome}`;

    botaoSair.addEventListener("click", function () {
        localStorage.removeItem("zuppyToken");
        localStorage.removeItem("zuppyNome");
        window.location.reload();
    });
}

exibirUsuarioLogado();
