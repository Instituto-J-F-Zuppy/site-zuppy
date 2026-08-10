// formata valores para real (R$)
function formatarMoedaPedido(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// converte a data iso em data e hora pt-BR
function formatarDataPedido(valorIso) {
    if (!valorIso) return "";

    const data = new Date(valorIso);

    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// traduz os status do backend para o usuario
const STATUS_LEGIVEL = {
    AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
    PAGO: "Pago",
    ENVIADO: "Enviado",
    ENTREGUE: "Entregue",
    CANCELADO: "Cancelado"
};

// monta o card de um pedido
function criarCardPedido(pedido) {
    // cria o elemento do card
    const card = document.createElement("article");
    card.className = "card-pedido";

    // monta o cabecalho
    const cabecalho = document.createElement("div");
    cabecalho.className = "card-pedido-cabecalho";

    // numero do pedido
    const numero = document.createElement("span");
    numero.className = "card-pedido-numero";
    numero.textContent = pedido.numero;
    cabecalho.appendChild(numero);

    // status traduzido
    const status = document.createElement("span");
    status.className = "card-pedido-status";
    status.textContent = STATUS_LEGIVEL[pedido.status] || pedido.status;
    cabecalho.appendChild(status);

    // data do pedido
    const data = document.createElement("span");
    data.className = "card-pedido-data";
    data.textContent = formatarDataPedido(pedido.criadoEm);
    cabecalho.appendChild(data);

    card.appendChild(cabecalho);

    // monta a lista de itens
    const listaItens = document.createElement("div");
    listaItens.className = "card-pedido-itens";

    // cria cada linha de item
    pedido.itens.forEach(function (item) {
        const linha = document.createElement("div");
        linha.className = "card-pedido-item";

        // quantidade e nome do item
        const nome = document.createElement("span");
        nome.textContent = `${item.quantidade}x ${item.nomeBrinquedo}`;

        // subtotal
        const preco = document.createElement("span");
        preco.textContent = formatarMoedaPedido(item.subtotal);

        linha.appendChild(nome);
        linha.appendChild(preco);
        listaItens.appendChild(linha);
    });

    card.appendChild(listaItens);

    // monta o rodape
    const rodape = document.createElement("div");
    rodape.className = "card-pedido-rodape";

    // endereco de entrega
    const endereco = document.createElement("span");
    endereco.textContent = `Entrega: ${pedido.endereco}, ${pedido.numeroEndereco} - ${pedido.cidade}/${pedido.uf}`;

    // valor total
    const total = document.createElement("span");
    total.className = "card-pedido-total";
    total.textContent = formatarMoedaPedido(pedido.valorTotal);

    rodape.appendChild(endereco);
    rodape.appendChild(total);

    card.appendChild(rodape);

    return card;
}

// elementos da tela
const pedidosRequerLogin = document.getElementById("pedidosRequerLogin");
const pedidosCarregando = document.getElementById("pedidosCarregando");
const pedidosVazio = document.getElementById("pedidosVazio");
const pedidosErro = document.getElementById("pedidosErro");
const listaPedidos = document.getElementById("listaPedidos");

// pega o token do usuario
const tokenPedidos = localStorage.getItem("zuppyToken");

// pede login se nao tiver token
if (!tokenPedidos) {
    pedidosCarregando.style.display = "none";
    pedidosRequerLogin.style.display = "block";
} else {
    // mostra o carregando e esconde o resto
    pedidosCarregando.style.display = "flex";
    pedidosVazio.style.display = "none";
    pedidosErro.style.display = "none";

    // busca os pedidos no servidor
    fetch("/pedidos", {
        headers: {
            "Authorization": `Bearer ${tokenPedidos}`
        }
    })
        .then(async function (resposta) {
            // tenta converter para json
            const dados = await resposta.json().catch(function () {
                return null;
            });

            // trata erro do servidor
            if (!resposta.ok) {
                const mensagem = dados && dados.erro
                    ? dados.erro
                    : "Não foi possível carregar seus pedidos. Tente novamente.";
                throw new Error(mensagem);
            }

            // avisa se a lista vier vazia
            if (!Array.isArray(dados) || dados.length === 0) {
                pedidosVazio.style.display = "block";
                return;
            }

            // agrupa os cards antes de jogar na tela
            const fragmento = document.createDocumentFragment();

            dados.forEach(function (pedido) {
                fragmento.appendChild(criarCardPedido(pedido));
            });

            listaPedidos.appendChild(fragmento);
        })
        .catch(function (erro) {
            // mostra a mensagem de erro se der falha
            pedidosErro.textContent = erro.message;
            pedidosErro.style.display = "block";
        })
        .finally(function () {
            // esconde o carregando no final
            pedidosCarregando.style.display = "none";
        });
}