const CHAVE_FAVORITOS_ANTIGA = "zuppyFavoritos";

const CHAVE_BASE_FAVORITOS = "zuppyFavoritos";

function obterChaveFavoritos() {
    if (!window.ControleConta) {
        return null;
    }

    const identificador = window.ControleConta.obterIdentificadorUsuario();

    if (!identificador) {
        return null;
    }

    return `${CHAVE_BASE_FAVORITOS}:${identificador}`;
}

function migrarFavoritosAntigos(chaveAtual) {
    if (localStorage.getItem(chaveAtual) !== null) {
        return;
    }

    const dadosAntigos =
        localStorage.getItem(
            CHAVE_FAVORITOS_ANTIGA
        );

    if (!dadosAntigos) {
        return;
    }

    localStorage.setItem(
        chaveAtual,
        dadosAntigos
    );

    localStorage.removeItem(
        CHAVE_FAVORITOS_ANTIGA
    );
}

function lerFavoritos() {
    const chave =
        obterChaveFavoritos();

    if (!chave) {
        return [];
    }

    migrarFavoritosAntigos(
        chave
    );

    try {
        const dados =
            localStorage.getItem(
                chave
            );

        const favoritos =
            dados
                ? JSON.parse(dados)
                : [];

        return Array.isArray(
            favoritos
        )
            ? favoritos
            : [];
    } catch {
        return [];
    }
}

function salvarFavoritos(ids) {
    const chave =
        obterChaveFavoritos();

    if (!chave) {
        return false;
    }

    localStorage.setItem(
        chave,
        JSON.stringify(
            [...new Set(ids)]
        )
    );

    window.dispatchEvent(
        new CustomEvent(
            "favoritos-atualizados"
        )
    );

    return true;
}

const FavoritosStore = {
    listar: function () {
        return lerFavoritos();
    },

    estaFavoritado: function (id) {
        return lerFavoritos()
            .includes(id);
    },

    alternar: function (id) {
        if (
            !window.ControleConta ||
            !window.ControleConta.exigirConta(
                "favoritos"
            )
        ) {
            return null;
        }

        const ids =
            lerFavoritos();

        const indice =
            ids.indexOf(id);

        if (indice === -1) {
            ids.push(id);

            salvarFavoritos(ids);

            return true;
        }

        ids.splice(indice, 1);

        salvarFavoritos(ids);

        return false;
    }
};