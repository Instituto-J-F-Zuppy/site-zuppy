function formatarMoedaPedido(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

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

const STATUS_LEGIVEL = {
    AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
    PAGO: "Pago",
    ENVIADO: "Enviado",
    ENTREGUE: "Entregue",
    CANCELADO: "Cancelado"
};

function criarCardPedido(pedido) {
    const card = document.createElement("article");
    card.className = "card-pedido";

    const cabecalho = document.createElement("div");
    cabecalho.className = "card-pedido-cabecalho";

    const numero = document.createElement("span");
    numero.className = "card-pedido-numero";
    numero.textContent = pedido.numero;
    cabecalho.appendChild(numero);

    const status = document.createElement("span");
    status.className = "card-pedido-status";
    status.textContent = STATUS_LEGIVEL[pedido.status] || pedido.status;
    cabecalho.appendChild(status);

    const data = document.createElement("span");
    data.className = "card-pedido-data";
    data.textContent = formatarDataPedido(pedido.criadoEm);
    cabecalho.appendChild(data);

    card.appendChild(cabecalho);

    const listaItens = document.createElement("div");
    listaItens.className = "card-pedido-itens";

    pedido.itens.forEach(function (item) {
        const linha = document.createElement("div");
        linha.className = "card-pedido-item";

        const nome = document.createElement("span");
        nome.textContent = `${item.quantidade}x ${item.nomeBrinquedo}`;

        const preco = document.createElement("span");
        preco.textContent = formatarMoedaPedido(item.subtotal);

        linha.appendChild(nome);
        linha.appendChild(preco);
        listaItens.appendChild(linha);
    });

    card.appendChild(listaItens);

    const rodape = document.createElement("div");
    rodape.className = "card-pedido-rodape";

    const endereco = document.createElement("span");
    endereco.textContent = `Entrega: ${pedido.endereco}, ${pedido.numeroEndereco} - ${pedido.cidade}/${pedido.uf}`;

    const total = document.createElement("span");
    total.className = "card-pedido-total";
    total.textContent = formatarMoedaPedido(pedido.valorTotal);

    rodape.appendChild(endereco);
    rodape.appendChild(total);
    card.appendChild(rodape);

    return card;
}

const pedidosRequerLogin = document.getElementById("pedidosRequerLogin");
const pedidosVazio = document.getElementById("pedidosVazio");
const pedidosErro = document.getElementById("pedidosErro");
const listaPedidos = document.getElementById("listaPedidos");

const tokenPedidos = localStorage.getItem("zuppyToken");

if (!tokenPedidos) {
    pedidosRequerLogin.style.display = "block";
} else {
    fetch("/pedidos", {
        headers: {
            "Authorization": `Bearer ${tokenPedidos}`
        }
    })
        .then(async function (resposta) {
            const dados = await resposta.json().catch(function () {
                return null;
            });

            if (!resposta.ok) {
                const mensagem = dados && dados.erro
                    ? dados.erro
                    : "Não foi possível carregar seus pedidos. Tente novamente.";

                throw new Error(mensagem);
            }

            if (!Array.isArray(dados) || dados.length === 0) {
                pedidosVazio.style.display = "block";
                return;
            }

            const fragmento = document.createDocumentFragment();
            dados.forEach(function (pedido) {
                fragmento.appendChild(criarCardPedido(pedido));
            });
            listaPedidos.appendChild(fragmento);
        })
        .catch(function (erro) {
            pedidosErro.textContent = erro.message;
            pedidosErro.style.display = "block";
        });
}
