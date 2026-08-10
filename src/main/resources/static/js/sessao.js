// exibe a area do usuario logado ou os links de login
function exibirUsuarioLogado() {
    // elementos do cabeçalho
    const linkCadastrar = document.getElementById("linkCadastrar");
    const linkEntrar = document.getElementById("linkEntrar");
    const areaUsuarioLogado = document.getElementById("areaUsuarioLogado");
    const saudacaoUsuario = document.getElementById("saudacaoUsuario");
    const botaoSair = document.getElementById("botaoSair");

    // cancela se faltar algum elemento base na pagina
    if (!linkCadastrar || !linkEntrar || !areaUsuarioLogado || !saudacaoUsuario || !botaoSair) {
        return;
    }

    // busca os dados do usuario ativo
    const usuario = window.ControleConta ? window.ControleConta.obterUsuario() : null;

    // se nao estiver logado, mostra apenas os links de entrar/cadastrar
    if (!usuario) {
        linkCadastrar.style.display = "";
        linkEntrar.style.display = "";
        areaUsuarioLogado.style.display = "none";
        return;
    }

    // pega o primeiro nome do usuario
    const primeiroNome = usuario.nome.trim().split(" ")[0];

    // esconde links de acesso e mostra a area logada
    linkCadastrar.style.display = "none";
    linkEntrar.style.display = "none";
    areaUsuarioLogado.style.display = "flex";

    saudacaoUsuario.textContent = `Olá, ${primeiroNome}`;

    // insere o link de meus pedidos se ainda nao existir
    if (!document.getElementById("linkMeusPedidos")) {
        const linkMeusPedidos = document.createElement("a");
        linkMeusPedidos.id = "linkMeusPedidos";
        linkMeusPedidos.href = "meus-pedidos.html";
        linkMeusPedidos.textContent = "Meus pedidos";
        linkMeusPedidos.style.fontSize = "13px";

        areaUsuarioLogado.insertBefore(linkMeusPedidos, saudacaoUsuario);
    }

    // insere o link de favoritos se ainda nao existir
    if (!document.getElementById("linkFavoritos")) {
        const linkFavoritos = document.createElement("a");
        linkFavoritos.id = "linkFavoritos";
        linkFavoritos.href = "meus-favoritos.html";
        linkFavoritos.textContent = "Favoritos";
        linkFavoritos.style.fontSize = "13px";

        areaUsuarioLogado.insertBefore(linkFavoritos, saudacaoUsuario);
    }

    // acao do botao de logout
    botaoSair.onclick = function () {
        localStorage.removeItem("zuppyToken");
        localStorage.removeItem("zuppyNome");
        window.location.reload();
    };
}

// executa a verificacao ao carregar o script
exibirUsuarioLogado();