const CHAVE_FAVORITOS = "zuppyFavoritos";

function lerFavoritos() {
  const dados = localStorage.getItem(CHAVE_FAVORITOS);
  return dados ? JSON.parse(dados) : [];
}

function salvarFavoritos(ids) {
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(ids));
}

const FavoritosStore = {
  listar: function () {
    return lerFavoritos();
  },

  estaFavoritado: function (id) {
    return lerFavoritos().includes(id);
  },

  alternar: function (id) {
    const ids = lerFavoritos();
    const indice = ids.indexOf(id);

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
