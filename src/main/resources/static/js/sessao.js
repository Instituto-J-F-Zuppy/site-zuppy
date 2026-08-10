function exibirUsuarioLogado() {
    const linkCadastrar =
        document.getElementById(
            "linkCadastrar"
        );

    const linkEntrar =
        document.getElementById(
            "linkEntrar"
        );

    const areaUsuarioLogado =
        document.getElementById(
            "areaUsuarioLogado"
        );

    const saudacaoUsuario =
        document.getElementById(
            "saudacaoUsuario"
        );

    const botaoSair =
        document.getElementById(
            "botaoSair"
        );

    if (
        !linkCadastrar ||
        !linkEntrar ||
        !areaUsuarioLogado ||
        !saudacaoUsuario ||
        !botaoSair
    ) {
        return;
    }

    const usuario =
        window.ControleConta
            ? window.ControleConta
                .obterUsuario()
            : null;

    if (!usuario) {
        linkCadastrar.style.display =
            "";

        linkEntrar.style.display =
            "";

        areaUsuarioLogado.style.display =
            "none";

        return;
    }

    const primeiroNome =
        usuario.nome
            .trim()
            .split(" ")[0];

    linkCadastrar.style.display =
        "none";

    linkEntrar.style.display =
        "none";

    areaUsuarioLogado.style.display =
        "flex";

    saudacaoUsuario.textContent =
        `Olá, ${primeiroNome}`;

    if (
        !document.getElementById(
            "linkMeusPedidos"
        )
    ) {
        const linkMeusPedidos =
            document.createElement("a");

        linkMeusPedidos.id =
            "linkMeusPedidos";

        linkMeusPedidos.href =
            "meus-pedidos.html";

        linkMeusPedidos.textContent =
            "Meus pedidos";

        linkMeusPedidos.style.fontSize =
            "13px";

        areaUsuarioLogado.insertBefore(
            linkMeusPedidos,
            saudacaoUsuario
        );
    }

    if (
        !document.getElementById(
            "linkFavoritos"
        )
    ) {
        const linkFavoritos =
            document.createElement("a");

        linkFavoritos.id =
            "linkFavoritos";

        linkFavoritos.href =
            "meus-favoritos.html";

        linkFavoritos.textContent =
            "Favoritos";

        linkFavoritos.style.fontSize =
            "13px";

        areaUsuarioLogado.insertBefore(
            linkFavoritos,
            saudacaoUsuario
        );
    }

    botaoSair.onclick =
        function () {
            localStorage.removeItem(
                "zuppyToken"
            );

            localStorage.removeItem(
                "zuppyNome"
            );

            window.location.reload();
        };
}

exibirUsuarioLogado();