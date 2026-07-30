const CHAVE_CARRINHO= "zuppyCarrinho";

function lerCarrinho() {
  const dados = localStorage.getItem(CHAVE_CARRINHO);
  return dados ? JSON.parse(dados) : [];
}

function salvarCarrinho(itens) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
  window.dispatchEvent(new CustomEvent("carrinho-atualizado"));
}

const CarrinhoStore = {
  listar: function() {
    return lerCarrinho();
  },

  adicionar: function(produto) {
    const itens = lerCarrinho();
    const existente = itens.find(function(item) {
      return item.id === produto.id;
    });

    if (existente) {
      existente.quantidade += 1;
    } else {
      itens.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        quantidade: 1
      });
    }
    salvarCarrinho(itens);
  },
  remover: function(id) {
    const itens = lerCarrinho().filter(function(item) {
      return item.id !== id;
    });
    salvarCarrinho(itens);
  },
  aumentar: function(id) {
    const itens = lerCarrinho();
    const item = itens.find(function(i){
      return i.id === id;
    });
    if (item) {
      item.quantidade += 1;
      salvarCarrinho(itens);
    }
  },

  diminuir: function(id) {
    const itens = lerCarrinho();
    const item = itens.find(function(i){
      return i.id === id;
    });

    if(!item) return;

    if (item.quantidade > 1) {
      item.quantidade -= 1;
      salvarCarrinho(itens);
    }
    else {
      const itensAtualizados = itens.filter(function(i) {
        return i.id !== id;
      });
      salvarCarrinho(itensAtualizados);
    }
  },
  limpar: function() {
    salvarCarrinho([]);
  },
  contarProdutos: function() {
    return lerCarrinho().length;
  }
};

function atualizarBadgeCarrinho() {
  const badge = document.getElementById(".carrinho-badge");
  if(!badge) return;
  const quantidade = CarrinhoStore.contarProdutos();
  badge.textContent = quantidade > 0 ? String(quantidade) : "";
}

atualizarBadgeCarrinho();
window.addEventListener("carrinhoAtualizado", atualizarBadgeCarrinho);
