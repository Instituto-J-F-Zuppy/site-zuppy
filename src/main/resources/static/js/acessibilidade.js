"use strict";

const roteiroAcessibilidade = document.currentScript;

document.addEventListener("DOMContentLoaded", () => {
    const enderecoRoteiro = roteiroAcessibilidade?.src || new URL("js/acessibilidade.js", window.location.href).href;
    const raizPublica = new URL("../", enderecoRoteiro);
    const caminhoPublico = (caminho) => new URL(caminho, raizPublica).href;
    const documento = document.documentElement;
    const corpo = document.body;
    const chaveConfiguracoes = "zuppy-configuracoes-acessibilidade-v4";
    const chaveFocoPesquisa = "zuppy-focar-pesquisa";
    const configuracoesPadrao = {
        nivelFonte: 0,
        estiloTexto: 0,
        letrasDestacadas: false,
        nivelLinhas: 0,
        nivelLetras: 0,
        mascaraLeitura: false,
        guiaLeitura: false,
        destacarLinks: false,
        lupaConteudo: false,
        contraste: false,
        saturacao: 0,
        destacarCabecalhos: false,
        esconderImagens: false,
        pausarAnimacoes: false,
        modoDaltonico: 0
    };
    const fatoresFonte = [1, 1.125, 1.25, 1.375];
    const nomesEstiloTexto = ["Original", "Arial", "Verdana", "Georgia"];
    const nomesNivelFonte = ["Original", "112%", "125%", "138%"];
    const nomesNivelLinhas = ["Original", "Médio", "Grande", "Muito grande"];
    const nomesNivelLetras = ["Original", "Médio", "Grande", "Muito grande"];
    const nomesSaturacao = ["Original", "Baixa", "Alta", "Escala de cinza"];
    const nomesDaltonismo = ["Desativado", "Protanopia", "Deuteranopia", "Tritanopia"];
    const seletorTextos = [
        "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "span", "button", "label", "input", "textarea", "select", "option", "li", "td", "th", "legend", "strong", "em", "small", "summary", "address", "time", "figcaption"
    ].join(",");
    const seletorLupa = "h1, h2, h3, h4, h5, h6, p, a, button, label, li, td, th, legend, summary, figcaption, .produto-tag, .preco-atual, .preco-antigo";
    const dadosBanners = {
        "promocao1.png": { titulo: "Ofertas imperdíveis", descricao: "Hora de garantir o presente com até 50% OFF.", cor: "#5a20c8", texto: "#ffffff", tipo: "principal" },
        "banner1.jpg": { titulo: "Brinquedo História", descricao: "Aproveite os bonecos exclusivos do filme.", cor: "#079D82", texto: "#ffffff", tipo: "secundario" },
        "banner2.jpg": { titulo: "Diversão", descricao: "Venha se divertir com até 50% OFF.", cor: "#F41B86", texto: "#ffffff", tipo: "secundario" },
        "banner3.jpg": { titulo: "Blocos de montar", descricao: "Construa o mundo que você quiser com até 50% OFF.", cor: "#17BEA6", texto: "#ffffff", tipo: "secundario" },
        "banner4.jpg": { titulo: "Torcida da diversão", descricao: "Entre na torcida com até 30% OFF.", cor: "#FDCE04", texto: "#15152f", tipo: "secundario" },
        "banner5.png": { titulo: "Mundo encantado", descricao: "Brinquedos mágicos com até 40% OFF.", cor: "#F83F7D", texto: "#ffffff", tipo: "secundario" }
    };
    const beneficiosZuppy = [
        { titulo: "Relâmpago Zuppy Express", descricao: "Envio rápido" },
        { titulo: "Frete grátis acima de R$199", descricao: "Para todo o Brasil" },
        { titulo: "Retire na loja em 90 minutos", descricao: "Compre online e retire na loja física" },
        { titulo: "Troque à vontade", descricao: "Até 30 dias para trocar ou devolver" },
        { titulo: "Parcele tudo em até 10 vezes", descricao: "Sem juros" },
        { titulo: "Exclusividade e 10% de desconto", descricao: "Na primeira compra" }
    ];
    let configuracoes = carregarConfiguracoes();
    let elementoFocadoAntesDoPainel = null;
    let elementoFocoAtual = null;
    let navegacaoPorTeclado = false;
    let falaAtual = null;
    let observadorVlibras = null;
    let observadorConteudo = null;
    let posicaoLeitura = Math.round(window.innerHeight / 2);
    let rafFoco = null;
    let arrastandoPainel = false;
    let deslocamentoPainelX = 0;
    let deslocamentoPainelY = 0;

    inserirEstruturaAcessibilidade();
    prepararPagina();
    prepararAcoesTextuaisCabecalho();
    prepararAssinaturasPipo();

    const raizAcessibilidade = document.getElementById("zuppyAcessibilidadeRaiz");
    const painel = document.getElementById("zuppyPainelAcessibilidade");
    const cabecalhoPainel = document.getElementById("zuppyCabecalhoPainel");
    const botaoAbrirPainel = document.getElementById("zuppyAbrirPainel");
    const botaoFecharPainel = document.getElementById("zuppyFecharPainel");
    const botaoLibras = document.getElementById("zuppyAbrirLibras");
    const botaoRestaurar = document.getElementById("zuppyRestaurarConfiguracoes");
    const estadoAcessibilidade = document.getElementById("zuppyEstadoAcessibilidade");
    const guiaLeitura = document.getElementById("zuppyGuiaLeitura");
    const mascaraLeitura = document.getElementById("zuppyMascaraLeitura");
    const indicadorFoco = document.getElementById("zuppyIndicadorFoco");
    const lupaConteudo = document.getElementById("zuppyLupaConteudo");
    const textoLupa = document.getElementById("zuppyTextoLupa");
    const botoesRecursos = Array.from(document.querySelectorAll("[data-recurso-acessibilidade]"));

    function carregarConfiguracoes() {
        try {
            const valor = JSON.parse(localStorage.getItem(chaveConfiguracoes) || "{}");
            return Object.keys(configuracoesPadrao).reduce((resultado, chave) => {
                resultado[chave] = Object.prototype.hasOwnProperty.call(valor, chave) ? valor[chave] : configuracoesPadrao[chave];
                return resultado;
            }, {});
        } catch {
            return { ...configuracoesPadrao };
        }
    }

    function salvarConfiguracoes() {
        try {
            localStorage.setItem(chaveConfiguracoes, JSON.stringify(configuracoes));
        } catch {
            return;
        }
    }

    function marcarFocoPesquisa() {
        try {
            sessionStorage.setItem(chaveFocoPesquisa, "true");
        } catch {
            return;
        }
    }

    function consumirFocoPesquisa() {
        try {
            const deveFocar = sessionStorage.getItem(chaveFocoPesquisa) === "true";
            if (deveFocar) sessionStorage.removeItem(chaveFocoPesquisa);
            return deveFocar;
        } catch {
            return false;
        }
    }

    function criarCartao(recurso, icone, titulo, estado, possuiNiveis) {
        const niveis = possuiNiveis ? `<span class="zuppy-indicador-niveis" aria-hidden="true"><span></span><span></span><span></span></span>` : "";
        return `<button type="button" class="zuppy-cartao-recurso" data-recurso-acessibilidade="${recurso}" aria-pressed="false"><span class="zuppy-icone-recurso" aria-hidden="true">${icone}</span><strong>${titulo}</strong><span class="zuppy-estado-recurso">${estado}</span>${niveis}</button>`;
    }

    function inserirEstruturaAcessibilidade() {
        const caminhoIconeRecursos = caminhoPublico("img/icone_pipo_recursos_acessibilidade.png");
        const caminhoIconeLibras = caminhoPublico("img/icone_libras.png");
        const caminhoPipo = caminhoPublico("img/zuppy_seletor.png");
        const caminhoPagina = caminhoPublico("acessibilidade.html");
        const raiz = document.createElement("div");
        raiz.id = "zuppyAcessibilidadeRaiz";
        raiz.className = "zuppy-acessibilidade-raiz";
        raiz.innerHTML = `
            <nav class="zuppy-atalhos-acessibilidade" aria-label="Atalhos de acessibilidade">
                <button type="button" class="zuppy-atalho-acessibilidade" id="zuppyAbrirPainel" aria-label="Abrir recursos assistivos" aria-controls="zuppyPainelAcessibilidade" aria-expanded="false">
                    <span class="zuppy-area-icone"><img src="${caminhoIconeRecursos}" alt="" aria-hidden="true"></span>
                    <span class="zuppy-nome-atalho">Recursos assistivos</span>
                </button>
                <button type="button" class="zuppy-atalho-acessibilidade" id="zuppyAbrirLibras" aria-label="Abrir ou fechar tradução para Libras">
                    <span class="zuppy-area-icone"><img src="${caminhoIconeLibras}" alt="" aria-hidden="true"></span>
                    <span class="zuppy-nome-atalho">Acessível em Libras</span>
                </button>
            </nav>
            <aside class="zuppy-painel-acessibilidade" id="zuppyPainelAcessibilidade" aria-labelledby="zuppyTituloPainel" aria-hidden="true" inert>
                <header class="zuppy-cabecalho-painel" id="zuppyCabecalhoPainel">
                    <h2 id="zuppyTituloPainel">Recursos assistivos</h2>
                    <button type="button" class="zuppy-fechar-painel" id="zuppyFecharPainel" aria-label="Fechar recursos assistivos">×</button>
                </header>
                <div class="zuppy-conteudo-painel">
                    <div class="zuppy-somente-leitor" id="zuppyEstadoAcessibilidade" role="status" aria-live="polite"></div>
                    <section class="zuppy-secao-recursos">
                        <h3>Libras</h3>
                        <div class="zuppy-grade-recursos">
                            ${criarCartao("tradutor-libras", "🤟", "Tradutor de Libras", "Abrir ou fechar", false)}
                        </div>
                    </section>
                    <section class="zuppy-secao-recursos">
                        <h3>Controle de fonte</h3>
                        <div class="zuppy-grade-recursos">
                            ${criarCartao("tamanho-fonte", "A+", "Tamanho da fonte", "Original", true)}
                            ${criarCartao("estilo-texto", "Aa", "Estilo de texto", "Original", true)}
                            ${criarCartao("letras-destacadas", "B", "Letras destacadas", "Desativado", false)}
                            ${criarCartao("espaco-linhas", "↕", "Espaço entre linhas", "Original", true)}
                            ${criarCartao("espaco-letras", "A↔a", "Espaço entre letras", "Original", true)}
                        </div>
                    </section>
                    <section class="zuppy-secao-recursos">
                        <h3>Navegação e leitura</h3>
                        <div class="zuppy-grade-recursos">
                            ${criarCartao("leitor-sites", "◖))", "Leitor de sites", "Iniciar leitura", false)}
                            ${criarCartao("mascara-leitura", "▬", "Máscara de leitura", "Desativada", false)}
                            ${criarCartao("guia-leitura", "━", "Guia de leitura", "Desativada", false)}
                            ${criarCartao("destacar-links", "🔗", "Destacar links", "Desativado", false)}
                            ${criarCartao("lupa-conteudo", "⌕", "Lupa de conteúdo", "Desativada", false)}
                            ${criarCartao("destacar-cabecalhos", "H", "Destacar cabeçalhos", "Desativado", false)}
                            ${criarCartao("esconder-imagens", "▧", "Esconder imagens", "Desativado", false)}
                            ${criarCartao("pausar-animacoes", "Ⅱ", "Pausar animações", "Desativado", false)}
                        </div>
                    </section>
                    <section class="zuppy-secao-recursos">
                        <h3>Controle de cor</h3>
                        <div class="zuppy-grade-recursos">
                            ${criarCartao("contraste", "◐", "Contraste de cor", "Desativado", false)}
                            ${criarCartao("saturacao", "◒", "Saturação", "Original", true)}
                            ${criarCartao("modo-daltonico", "🎨", "Modo daltônico", "Desativado", true)}
                        </div>
                    </section>
                    <footer class="zuppy-rodape-painel">
                        <a class="zuppy-link-pagina-acessibilidade" href="${caminhoPagina}">Conheça os recursos acessíveis</a>
                        <button type="button" id="zuppyRestaurarConfiguracoes">Restaurar configurações</button>
                    </footer>
                </div>
            </aside>
            <div class="zuppy-guia-leitura" id="zuppyGuiaLeitura" hidden aria-hidden="true"></div>
            <div class="zuppy-mascara-leitura" id="zuppyMascaraLeitura" hidden aria-hidden="true"></div>
            <div class="zuppy-indicador-foco" id="zuppyIndicadorFoco" hidden aria-hidden="true"><img src="${caminhoPipo}" alt=""></div>
            <div class="zuppy-lupa-conteudo" id="zuppyLupaConteudo" hidden aria-hidden="true"><img src="${caminhoPipo}" alt=""><div id="zuppyTextoLupa"></div></div>
            <svg class="zuppy-filtros-cor" aria-hidden="true" focusable="false">
                <defs>
                    <filter id="zuppyFiltroProtanopia"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"></feColorMatrix></filter>
                    <filter id="zuppyFiltroDeuteranopia"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.700 0.300 0 0 0 0 0.300 0.700 0 0 0 0 0 1 0"></feColorMatrix></filter>
                    <filter id="zuppyFiltroTritanopia"><feColorMatrix type="matrix" values="0.950 0.050 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"></feColorMatrix></filter>
                </defs>
            </svg>
        `;
        corpo.appendChild(raiz);
    }

    function prepararPagina() {
        const conteudo = document.querySelector("main");
        const pesquisa = encontrarCampoPesquisa();
        if (conteudo && !conteudo.id) conteudo.id = "conteudoPrincipal";
        if (pesquisa && !pesquisa.id) pesquisa.id = "campoPesquisaPrincipal";
    }

    function encontrarCampoPesquisa() {
        return document.getElementById("searchInput") || document.querySelector('input[type="search"], input[placeholder*="Encontre" i], input[placeholder*="pesquis" i]');
    }

    function anunciar(mensagem) {
        if (!estadoAcessibilidade) return;
        estadoAcessibilidade.textContent = "";
        window.setTimeout(() => {
            estadoAcessibilidade.textContent = mensagem;
        }, 40);
    }

    function abrirPainel() {
        if (!painel) return;
        elementoFocadoAntesDoPainel = document.activeElement;
        painel.removeAttribute("inert");
        painel.setAttribute("aria-hidden", "false");
        painel.classList.add("zuppy-painel-aberto");
        botaoAbrirPainel.setAttribute("aria-expanded", "true");
        const primeiro = painel.querySelector("button, a[href]");
        primeiro?.focus();
    }

    function fecharPainel() {
        if (!painel) return;
        painel.classList.remove("zuppy-painel-aberto");
        painel.setAttribute("aria-hidden", "true");
        painel.setAttribute("inert", "");
        botaoAbrirPainel.setAttribute("aria-expanded", "false");
        if (elementoFocadoAntesDoPainel instanceof HTMLElement) elementoFocadoAntesDoPainel.focus();
    }

    function alternarPainel() {
        if (painel.classList.contains("zuppy-painel-aberto")) fecharPainel();
        else abrirPainel();
    }

    function iniciarArrastePainel(evento) {
        if (evento.button !== 0 || evento.target.closest("button, a, input, select, textarea")) return;
        const retangulo = painel.getBoundingClientRect();
        arrastandoPainel = true;
        deslocamentoPainelX = evento.clientX - retangulo.left;
        deslocamentoPainelY = evento.clientY - retangulo.top;
        painel.style.left = `${retangulo.left}px`;
        painel.style.top = `${retangulo.top}px`;
        painel.style.right = "auto";
        painel.style.transform = "none";
        cabecalhoPainel.setPointerCapture(evento.pointerId);
        corpo.classList.add("zuppy-arrastando-painel");
    }

    function moverPainel(evento) {
        if (!arrastandoPainel) return;
        const largura = painel.offsetWidth;
        const altura = painel.offsetHeight;
        const esquerda = Math.min(Math.max(8, evento.clientX - deslocamentoPainelX), Math.max(8, window.innerWidth - largura - 8));
        const topo = Math.min(Math.max(8, evento.clientY - deslocamentoPainelY), Math.max(8, window.innerHeight - altura - 8));
        painel.style.left = `${esquerda}px`;
        painel.style.top = `${topo}px`;
    }

    function finalizarArrastePainel(evento) {
        if (!arrastandoPainel) return;
        arrastandoPainel = false;
        corpo.classList.remove("zuppy-arrastando-painel");
        if (cabecalhoPainel.hasPointerCapture(evento.pointerId)) cabecalhoPainel.releasePointerCapture(evento.pointerId);
    }

    function ajustarPainelNaTela() {
        if (!painel.classList.contains("zuppy-painel-aberto") || !painel.style.left) return;
        const retangulo = painel.getBoundingClientRect();
        painel.style.left = `${Math.min(Math.max(8, retangulo.left), Math.max(8, window.innerWidth - retangulo.width - 8))}px`;
        painel.style.top = `${Math.min(Math.max(8, retangulo.top), Math.max(8, window.innerHeight - retangulo.height - 8))}px`;
    }

    function registrarTamanhoOriginal(elemento) {
        if (!(elemento instanceof HTMLElement) || elemento.closest("#zuppyAcessibilidadeRaiz, [vw]")) return;
        if (elemento.dataset.zuppyFonteOriginalPx) return;
        const tamanho = Number.parseFloat(window.getComputedStyle(elemento).fontSize);
        if (!Number.isFinite(tamanho)) return;
        elemento.dataset.zuppyFonteOriginalPx = String(tamanho);
        elemento.dataset.zuppyFonteOriginalInline = elemento.style.fontSize || "";
    }

    function aplicarFonteEmElemento(elemento) {
        registrarTamanhoOriginal(elemento);
        const tamanhoOriginal = Number(elemento.dataset.zuppyFonteOriginalPx);
        if (!Number.isFinite(tamanhoOriginal)) return;
        if (configuracoes.nivelFonte === 0) {
            const valorInline = elemento.dataset.zuppyFonteOriginalInline || "";
            if (valorInline) elemento.style.fontSize = valorInline;
            else elemento.style.removeProperty("font-size");
            return;
        }
        elemento.style.fontSize = `${(tamanhoOriginal * fatoresFonte[configuracoes.nivelFonte]).toFixed(2)}px`;
    }

    function aplicarTamanhoFonte(anunciarMudanca = false) {
        document.querySelectorAll(seletorTextos).forEach(aplicarFonteEmElemento);
        atualizarCartao("tamanho-fonte", configuracoes.nivelFonte, nomesNivelFonte[configuracoes.nivelFonte]);
        if (anunciarMudanca) anunciar(configuracoes.nivelFonte === 0 ? "Tamanho original da fonte restaurado." : `Tamanho da fonte no nível ${configuracoes.nivelFonte} de 3.`);
    }

    function alternarNivel(chave, maximo, nomes, recurso, mensagem) {
        configuracoes[chave] = (Number(configuracoes[chave]) + 1) % (maximo + 1);
        salvarConfiguracoes();
        aplicarConfiguracaoVisual(recurso);
        atualizarCartao(recurso, configuracoes[chave], nomes[configuracoes[chave]]);
        anunciar(`${mensagem}: ${nomes[configuracoes[chave]]}.`);
    }

    function aplicarConfiguracaoVisual(recurso) {
        if (recurso === "tamanho-fonte") aplicarTamanhoFonte(false);
        if (recurso === "estilo-texto") documento.dataset.estiloTexto = String(configuracoes.estiloTexto);
        if (recurso === "letras-destacadas") documento.dataset.letrasDestacadas = String(configuracoes.letrasDestacadas);
        if (recurso === "espaco-linhas") documento.dataset.espacoLinhas = String(configuracoes.nivelLinhas);
        if (recurso === "espaco-letras") documento.dataset.espacoLetras = String(configuracoes.nivelLetras);
        if (recurso === "destacar-links") documento.dataset.destacarLinks = String(configuracoes.destacarLinks);
        if (recurso === "lupa-conteudo") documento.dataset.lupaConteudo = String(configuracoes.lupaConteudo);
        if (recurso === "contraste") {
            documento.dataset.contrasteAcessivel = String(configuracoes.contraste);
            atualizarImagemBeneficiosContraste();
        }
        if (recurso === "saturacao") documento.dataset.saturacaoAcessivel = String(configuracoes.saturacao);
        if (recurso === "destacar-cabecalhos") documento.dataset.destacarCabecalhos = String(configuracoes.destacarCabecalhos);
        if (recurso === "pausar-animacoes") documento.dataset.animacoesPausadas = String(configuracoes.pausarAnimacoes);
        if (recurso === "modo-daltonico") documento.dataset.modoDaltonico = String(configuracoes.modoDaltonico);
    }

    function atualizarCartao(recurso, nivel, estado) {
        const botao = document.querySelector(`[data-recurso-acessibilidade="${recurso}"]`);
        if (!botao) return;
        const ativo = Number.isFinite(Number(nivel)) ? Number(nivel) > 0 : Boolean(nivel);
        botao.setAttribute("aria-pressed", String(ativo));
        botao.dataset.nivel = String(Number.isFinite(Number(nivel)) ? nivel : ativo ? 1 : 0);
        const campoEstado = botao.querySelector(".zuppy-estado-recurso");
        if (campoEstado) campoEstado.textContent = estado;
        const pontos = Array.from(botao.querySelectorAll(".zuppy-indicador-niveis span"));
        pontos.forEach((ponto, indice) => ponto.classList.toggle("zuppy-nivel-ativo", indice < Number(nivel)));
    }

    function alternarBooleano(chave, recurso, mensagemAtiva, mensagemInativa, estadoAtivo = "Ativado", estadoInativo = "Desativado") {
        configuracoes[chave] = !configuracoes[chave];
        salvarConfiguracoes();
        aplicarConfiguracaoVisual(recurso);
        atualizarCartao(recurso, configuracoes[chave], configuracoes[chave] ? estadoAtivo : estadoInativo);
        anunciar(configuracoes[chave] ? mensagemAtiva : mensagemInativa);
    }

    function aplicarLetrasDestacadas() {
        aplicarConfiguracaoVisual("letras-destacadas");
        atualizarCartao("letras-destacadas", configuracoes.letrasDestacadas, configuracoes.letrasDestacadas ? "Ativado" : "Desativado");
    }

    function alternarLetrasDestacadas() {
        configuracoes.letrasDestacadas = !configuracoes.letrasDestacadas;
        salvarConfiguracoes();
        aplicarLetrasDestacadas();
        anunciar(configuracoes.letrasDestacadas ? "Todas as letras foram destacadas." : "Destaque das letras removido.");
    }

    function obterTextoLeitura() {
        const alvo = document.querySelector("main") || corpo;
        const copia = alvo.cloneNode(true);
        copia.querySelectorAll("script, style, noscript, button, input, textarea, select, #zuppyAcessibilidadeRaiz, [aria-hidden=\"true\"]").forEach((elemento) => elemento.remove());
        return copia.innerText.replace(/\s+/g, " ").trim();
    }

    function alternarLeitorSites() {
        if (!("speechSynthesis" in window)) {
            anunciar("Seu navegador não oferece leitura em voz alta.");
            return;
        }
        if (falaAtual || window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            falaAtual = null;
            atualizarCartao("leitor-sites", false, "Iniciar leitura");
            anunciar("Leitura interrompida.");
            return;
        }
        const texto = obterTextoLeitura();
        if (!texto) {
            anunciar("Não foi encontrado conteúdo para leitura.");
            return;
        }
        falaAtual = new SpeechSynthesisUtterance(texto);
        falaAtual.lang = "pt-BR";
        falaAtual.rate = 1;
        falaAtual.onstart = () => atualizarCartao("leitor-sites", true, "Parar leitura");
        falaAtual.onend = () => {
            falaAtual = null;
            atualizarCartao("leitor-sites", false, "Iniciar leitura");
        };
        falaAtual.onerror = () => {
            falaAtual = null;
            atualizarCartao("leitor-sites", false, "Iniciar leitura");
        };
        window.speechSynthesis.speak(falaAtual);
        anunciar("Leitura da página iniciada.");
    }

    function aplicarGuiaMascara() {
        guiaLeitura.hidden = !configuracoes.guiaLeitura;
        mascaraLeitura.hidden = !configuracoes.mascaraLeitura;
        atualizarPosicaoLeitura(posicaoLeitura);
        atualizarCartao("guia-leitura", configuracoes.guiaLeitura, configuracoes.guiaLeitura ? "Ativada" : "Desativada");
        atualizarCartao("mascara-leitura", configuracoes.mascaraLeitura, configuracoes.mascaraLeitura ? "Ativada" : "Desativada");
    }

    function atualizarPosicaoLeitura(posicao) {
        posicaoLeitura = Math.max(70, Math.min(window.innerHeight - 70, posicao));
        guiaLeitura.style.top = `${posicaoLeitura}px`;
        mascaraLeitura.style.setProperty("--zuppy-posicao-leitura", `${posicaoLeitura}px`);
    }

    function alternarGuia() {
        configuracoes.guiaLeitura = !configuracoes.guiaLeitura;
        salvarConfiguracoes();
        aplicarGuiaMascara();
        anunciar(configuracoes.guiaLeitura ? "Guia de leitura ativada." : "Guia de leitura desativada.");
    }

    function alternarMascara() {
        configuracoes.mascaraLeitura = !configuracoes.mascaraLeitura;
        salvarConfiguracoes();
        aplicarGuiaMascara();
        anunciar(configuracoes.mascaraLeitura ? "Máscara de leitura ativada." : "Máscara de leitura desativada.");
    }

    function criarBannerTextual(conteiner, imagem) {
        if (conteiner.querySelector("[data-zuppy-banner-textual]")) return;
        const arquivo = decodeURIComponent(new URL(imagem.src, window.location.href).pathname.split("/").pop() || "").toLowerCase();
        const conteudo = dadosBanners[arquivo];
        if (!conteudo) return;
        const cartao = document.createElement("article");
        cartao.className = "zuppy-banner-textual";
        cartao.dataset.zuppyBannerTextual = "true";
        cartao.dataset.tipoBanner = conteudo.tipo;
        cartao.dataset.temaBanner = conteudo.texto === "#ffffff" ? "escuro" : "claro";
        cartao.style.setProperty("--zuppy-cor-banner-textual", conteudo.cor);
        cartao.style.setProperty("--zuppy-cor-texto-banner", conteudo.texto);
        const etiqueta = document.createElement("span");
        const titulo = document.createElement("h3");
        const descricao = document.createElement("p");
        etiqueta.textContent = "Oferta Zuppy";
        titulo.textContent = conteudo.titulo;
        descricao.textContent = conteudo.descricao;
        cartao.append(etiqueta, titulo, descricao);
        conteiner.classList.add("zuppy-conteiner-banner-textual");
        conteiner.appendChild(cartao);
    }

    function atualizarBannersTextuais() {
        const exibir = configuracoes.esconderImagens;
        if (!exibir) {
            document.querySelectorAll("[data-zuppy-banner-textual]").forEach((elemento) => elemento.remove());
            document.querySelectorAll(".zuppy-conteiner-banner-textual").forEach((elemento) => elemento.classList.remove("zuppy-conteiner-banner-textual"));
            return;
        }
        document.querySelectorAll(".promocao1, .card-banner").forEach((conteiner) => {
            const imagem = conteiner.querySelector("img");
            if (imagem) criarBannerTextual(conteiner, imagem);
        });
    }

    function criarBeneficiosTextuais() {
        const secao = document.querySelector(".beneficios");
        if (!secao || secao.querySelector("[data-zuppy-beneficios-textuais]")) return;
        const cartao = document.createElement("article");
        cartao.className = "zuppy-beneficios-textuais";
        cartao.dataset.zuppyBeneficiosTextuais = "true";
        const titulo = document.createElement("h2");
        const grade = document.createElement("div");
        titulo.textContent = "Benefícios Zuppy";
        grade.className = "zuppy-grade-beneficios-textuais";
        beneficiosZuppy.forEach((beneficio) => {
            const item = document.createElement("section");
            const nome = document.createElement("h3");
            const descricao = document.createElement("p");
            nome.textContent = beneficio.titulo;
            descricao.textContent = beneficio.descricao;
            item.append(nome, descricao);
            grade.appendChild(item);
        });
        cartao.append(titulo, grade);
        secao.appendChild(cartao);
    }

    function atualizarBeneficiosTextuais() {
        const exibir = configuracoes.esconderImagens;
        if (exibir) criarBeneficiosTextuais();
        else document.querySelectorAll("[data-zuppy-beneficios-textuais]").forEach((elemento) => elemento.remove());
    }

    function prepararAcoesTextuaisCabecalho() {
        document.querySelectorAll(".botao-icones, .header-acoes").forEach((area) => {
            if (area.querySelector(".zuppy-acoes-cabecalho-textuais")) return;
            const grupo = document.createElement("nav");
            grupo.className = "zuppy-acoes-cabecalho-textuais";
            grupo.setAttribute("aria-label", "Ações do cabeçalho");
            const acessibilidade = document.createElement("button");
            acessibilidade.type = "button";
            acessibilidade.textContent = "Acessibilidade";
            acessibilidade.dataset.abrirAcessibilidade = "true";
            const whatsapp = document.createElement("a");
            whatsapp.href = "#";
            whatsapp.textContent = "WhatsApp";
            grupo.append(acessibilidade, whatsapp);
            if (area.classList.contains("botao-icones")) {
                const carrinho = document.createElement("a");
                carrinho.href = caminhoPublico("carrinho.html");
                carrinho.textContent = "Carrinho";
                grupo.appendChild(carrinho);
            }
            area.appendChild(grupo);
        });
    }

    function prepararAssinaturasPipo() {
        document.querySelectorAll(".balao-fala").forEach((balao) => {
            if (balao.querySelector(".zuppy-assinatura-pipo")) return;
            const assinatura = document.createElement("span");
            assinatura.className = "zuppy-assinatura-pipo";
            assinatura.textContent = "— Pipo, mascote Zuppy";
            balao.appendChild(assinatura);
        });
    }


    function atualizarImagemBeneficiosContraste() {
        const imagem = document.querySelector(".beneficios-img[data-imagem-clara][data-imagem-escura]");
        if (!imagem) return;
        const fonte = configuracoes.contraste ? imagem.dataset.imagemEscura : imagem.dataset.imagemClara;
        if (!fonte) return;
        const endereco = new URL(fonte, window.location.href).href;
        if (imagem.src !== endereco) imagem.src = endereco;
    }

    function atualizarConteudosAlternativos() {
        atualizarBannersTextuais();
        atualizarBeneficiosTextuais();
    }

    function ocultarImagens() {
        const imagens = Array.from(document.images).filter((imagem) => !imagem.closest("#zuppyAcessibilidadeRaiz, [vw]"));
        imagens.forEach((imagem) => {
            if (configuracoes.esconderImagens) {
                if (imagem.dataset.zuppyImagemOculta) return;
                imagem.dataset.zuppyImagemOculta = "true";
                imagem.dataset.zuppyImagemHiddenOriginal = String(imagem.hidden);
                imagem.hidden = true;
            } else if (imagem.dataset.zuppyImagemOculta) {
                imagem.hidden = imagem.dataset.zuppyImagemHiddenOriginal === "true";
                delete imagem.dataset.zuppyImagemOculta;
                delete imagem.dataset.zuppyImagemHiddenOriginal;
            }
        });
        documento.dataset.imagensOcultas = String(configuracoes.esconderImagens);
        atualizarConteudosAlternativos();
        atualizarCartao("esconder-imagens", configuracoes.esconderImagens, configuracoes.esconderImagens ? "Ativado" : "Desativado");
    }

    function alternarImagens() {
        configuracoes.esconderImagens = !configuracoes.esconderImagens;
        salvarConfiguracoes();
        ocultarImagens();
        anunciar(configuracoes.esconderImagens ? "Imagens ocultadas. Os banners de ofertas foram convertidos em textos." : "Imagens exibidas novamente.");
    }

    function obterTextoElemento(elemento) {
        if (!(elemento instanceof HTMLElement)) return "";
        if (elemento instanceof HTMLInputElement || elemento instanceof HTMLTextAreaElement) return (elemento.value || elemento.placeholder || elemento.getAttribute("aria-label") || "").trim();
        return (elemento.innerText || elemento.textContent || elemento.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim();
    }

    function posicionarLupa(x, y) {
        const margem = 18;
        const largura = Math.min(560, window.innerWidth - margem * 2);
        lupaConteudo.style.width = `${largura}px`;
        const altura = lupaConteudo.offsetHeight || 120;
        const esquerda = Math.min(Math.max(margem, x + 22), window.innerWidth - largura - margem);
        const topoPreferencial = y + 24;
        const topo = topoPreferencial + altura > window.innerHeight - margem ? Math.max(margem, y - altura - 24) : topoPreferencial;
        lupaConteudo.style.left = `${esquerda}px`;
        lupaConteudo.style.top = `${topo}px`;
    }

    function mostrarLupaParaElemento(elemento, x, y) {
        if (!configuracoes.lupaConteudo || !(elemento instanceof HTMLElement) || elemento.closest("#zuppyAcessibilidadeRaiz, [vw]")) {
            lupaConteudo.hidden = true;
            return;
        }
        const alvo = elemento.closest(seletorLupa);
        if (!(alvo instanceof HTMLElement)) {
            lupaConteudo.hidden = true;
            return;
        }
        const texto = obterTextoElemento(alvo);
        if (!texto || texto.length < 2) {
            lupaConteudo.hidden = true;
            return;
        }
        textoLupa.textContent = texto;
        lupaConteudo.hidden = false;
        posicionarLupa(x, y);
    }

    function alternarLupaConteudo() {
        configuracoes.lupaConteudo = !configuracoes.lupaConteudo;
        salvarConfiguracoes();
        aplicarConfiguracaoVisual("lupa-conteudo");
        atualizarCartao("lupa-conteudo", configuracoes.lupaConteudo, configuracoes.lupaConteudo ? "Ativada" : "Desativada");
        if (!configuracoes.lupaConteudo) lupaConteudo.hidden = true;
        anunciar(configuracoes.lupaConteudo ? "Lupa de conteúdo ativada." : "Lupa de conteúdo desativada.");
    }


    function aplicarPausaAnimacoes() {
        aplicarConfiguracaoVisual("pausar-animacoes");
        if (configuracoes.pausarAnimacoes) document.querySelectorAll("video").forEach((video) => video.pause());
        atualizarCartao("pausar-animacoes", configuracoes.pausarAnimacoes, configuracoes.pausarAnimacoes ? "Ativado" : "Desativado");
    }

    function alternarAnimacoes() {
        configuracoes.pausarAnimacoes = !configuracoes.pausarAnimacoes;
        salvarConfiguracoes();
        aplicarPausaAnimacoes();
        anunciar(configuracoes.pausarAnimacoes ? "Animações pausadas." : "Animações reativadas.");
    }

    function obterElementosFiltraveis() {
        return Array.from(corpo.children).filter((elemento) => elemento.id !== "zuppyAcessibilidadeRaiz" && !elemento.hasAttribute("vw") && !["SCRIPT", "STYLE", "LINK"].includes(elemento.tagName));
    }

    function aplicarFiltrosCor() {
        const filtrosSaturacao = ["", "saturate(45%)", "saturate(180%)", "grayscale(100%)"];
        const idsDaltonismo = ["", "zuppyFiltroProtanopia", "zuppyFiltroDeuteranopia", "zuppyFiltroTritanopia"];
        obterElementosFiltraveis().forEach((elemento) => {
            if (elemento.dataset.zuppyFiltroOriginal === undefined) elemento.dataset.zuppyFiltroOriginal = elemento.style.filter || "";
            if (configuracoes.modoDaltonico > 0) {
                const endereco = new URL(window.location.href);
                endereco.hash = idsDaltonismo[configuracoes.modoDaltonico];
                elemento.style.filter = `url("${endereco.href}")`;
            } else if (configuracoes.saturacao > 0) {
                elemento.style.filter = filtrosSaturacao[configuracoes.saturacao];
            } else {
                const original = elemento.dataset.zuppyFiltroOriginal || "";
                if (original) elemento.style.filter = original;
                else elemento.style.removeProperty("filter");
                delete elemento.dataset.zuppyFiltroOriginal;
            }
        });
    }

    function aplicarSaturacao() {
        if (configuracoes.saturacao > 0) {
            configuracoes.modoDaltonico = 0;
            documento.dataset.modoDaltonico = "0";
            atualizarCartao("modo-daltonico", 0, nomesDaltonismo[0]);
        }
        salvarConfiguracoes();
        aplicarConfiguracaoVisual("saturacao");
        aplicarFiltrosCor();
        atualizarCartao("saturacao", configuracoes.saturacao, nomesSaturacao[configuracoes.saturacao]);
    }

    function aplicarDaltonismo() {
        if (configuracoes.modoDaltonico > 0) {
            configuracoes.saturacao = 0;
            documento.dataset.saturacaoAcessivel = "0";
            atualizarCartao("saturacao", 0, nomesSaturacao[0]);
        }
        salvarConfiguracoes();
        aplicarConfiguracaoVisual("modo-daltonico");
        aplicarFiltrosCor();
        atualizarCartao("modo-daltonico", configuracoes.modoDaltonico, nomesDaltonismo[configuracoes.modoDaltonico]);
    }

    function obterBotaoOficialVlibras() {
        return document.querySelector("[vw-access-button]");
    }

    function inserirVlibras() {
        if (!document.querySelector("[vw]")) {
            const area = document.createElement("div");
            area.setAttribute("vw", "");
            area.className = "enabled";
            area.innerHTML = `<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>`;
            corpo.appendChild(area);
        }
        if (window.VLibras?.Widget) {
            iniciarVlibras();
            return;
        }
        if (document.querySelector('script[src*="vlibras-plugin.js"]')) return;
        const script = document.createElement("script");
        script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
        script.onload = iniciarVlibras;
        script.onerror = () => anunciar("Não foi possível carregar o VLibras agora.");
        corpo.appendChild(script);
    }

    function iniciarVlibras() {
        if (!window.VLibras?.Widget || corpo.dataset.zuppyVlibrasIniciado === "true") return;
        corpo.dataset.zuppyVlibrasIniciado = "true";
        new window.VLibras.Widget("https://vlibras.gov.br/app");
        observarBotaoVlibras();
    }

    function prepararBotaoVlibras() {
        const botao = obterBotaoOficialVlibras();
        if (!(botao instanceof HTMLElement)) return false;
        botao.setAttribute("tabindex", "-1");
        botao.setAttribute("aria-hidden", "true");
        return true;
    }

    function observarBotaoVlibras() {
        if (prepararBotaoVlibras()) return;
        observadorVlibras?.disconnect();
        observadorVlibras = new MutationObserver(() => {
            if (prepararBotaoVlibras()) {
                observadorVlibras.disconnect();
                observadorVlibras = null;
            }
        });
        observadorVlibras.observe(corpo, { childList: true, subtree: true });
    }

    function alternarVlibras() {
        const botao = obterBotaoOficialVlibras();
        if (!(botao instanceof HTMLElement)) {
            anunciar("O tradutor de Libras ainda está carregando.");
            inserirVlibras();
            return;
        }
        botao.click();
        anunciar("Comando enviado ao tradutor de Libras.");
    }

    function executarRecurso(recurso) {
        if (recurso === "tradutor-libras") alternarVlibras();
        if (recurso === "tamanho-fonte") alternarNivel("nivelFonte", 3, nomesNivelFonte, recurso, "Tamanho da fonte");
        if (recurso === "estilo-texto") alternarNivel("estiloTexto", 3, nomesEstiloTexto, recurso, "Estilo de texto");
        if (recurso === "letras-destacadas") alternarLetrasDestacadas();
        if (recurso === "espaco-linhas") alternarNivel("nivelLinhas", 3, nomesNivelLinhas, recurso, "Espaçamento entre linhas");
        if (recurso === "espaco-letras") alternarNivel("nivelLetras", 3, nomesNivelLetras, recurso, "Espaçamento entre letras");
        if (recurso === "leitor-sites") alternarLeitorSites();
        if (recurso === "mascara-leitura") alternarMascara();
        if (recurso === "guia-leitura") alternarGuia();
        if (recurso === "destacar-links") alternarBooleano("destacarLinks", recurso, "Links destacados.", "Destaque de links removido.");
        if (recurso === "lupa-conteudo") alternarLupaConteudo();
        if (recurso === "destacar-cabecalhos") alternarBooleano("destacarCabecalhos", recurso, "Cabeçalhos destacados.", "Destaque de cabeçalhos removido.");
        if (recurso === "esconder-imagens") alternarImagens();
        if (recurso === "pausar-animacoes") alternarAnimacoes();
        if (recurso === "contraste") alternarBooleano("contraste", recurso, "Alto contraste ativado.", "Contraste original restaurado.");
        if (recurso === "saturacao") {
            configuracoes.saturacao = (configuracoes.saturacao + 1) % 4;
            salvarConfiguracoes();
            aplicarSaturacao();
            anunciar(`Saturação: ${nomesSaturacao[configuracoes.saturacao]}.`);
        }
        if (recurso === "modo-daltonico") {
            configuracoes.modoDaltonico = (configuracoes.modoDaltonico + 1) % 4;
            salvarConfiguracoes();
            aplicarDaltonismo();
            anunciar(`Modo daltônico: ${nomesDaltonismo[configuracoes.modoDaltonico]}.`);
        }
    }

    function restaurarTudo() {
        if (falaAtual || window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
        configuracoes = { ...configuracoesPadrao };
        salvarConfiguracoes();
        aplicarTodasConfiguracoes();
        anunciar("Todas as configurações de acessibilidade foram restauradas.");
    }

    function aplicarTodasConfiguracoes() {
        aplicarTamanhoFonte(false);
        documento.dataset.estiloTexto = String(configuracoes.estiloTexto);
        documento.dataset.letrasDestacadas = String(configuracoes.letrasDestacadas);
        documento.dataset.espacoLinhas = String(configuracoes.nivelLinhas);
        documento.dataset.espacoLetras = String(configuracoes.nivelLetras);
        documento.dataset.destacarLinks = String(configuracoes.destacarLinks);
        documento.dataset.lupaConteudo = String(configuracoes.lupaConteudo);
        documento.dataset.contrasteAcessivel = String(configuracoes.contraste);
        atualizarImagemBeneficiosContraste();
        documento.dataset.saturacaoAcessivel = String(configuracoes.saturacao);
        documento.dataset.destacarCabecalhos = String(configuracoes.destacarCabecalhos);
        documento.dataset.animacoesPausadas = String(configuracoes.pausarAnimacoes);
        documento.dataset.modoDaltonico = String(configuracoes.modoDaltonico);
        aplicarFiltrosCor();
        aplicarLetrasDestacadas();
        aplicarGuiaMascara();
        ocultarImagens();
        aplicarPausaAnimacoes();
        atualizarConteudosAlternativos();
        atualizarCartao("estilo-texto", configuracoes.estiloTexto, nomesEstiloTexto[configuracoes.estiloTexto]);
        atualizarCartao("espaco-linhas", configuracoes.nivelLinhas, nomesNivelLinhas[configuracoes.nivelLinhas]);
        atualizarCartao("espaco-letras", configuracoes.nivelLetras, nomesNivelLetras[configuracoes.nivelLetras]);
        atualizarCartao("destacar-links", configuracoes.destacarLinks, configuracoes.destacarLinks ? "Ativado" : "Desativado");
        atualizarCartao("lupa-conteudo", configuracoes.lupaConteudo, configuracoes.lupaConteudo ? "Ativada" : "Desativada");
        atualizarCartao("contraste", configuracoes.contraste, configuracoes.contraste ? "Ativado" : "Desativado");
        atualizarCartao("saturacao", configuracoes.saturacao, nomesSaturacao[configuracoes.saturacao]);
        atualizarCartao("destacar-cabecalhos", configuracoes.destacarCabecalhos, configuracoes.destacarCabecalhos ? "Ativado" : "Desativado");
        atualizarCartao("modo-daltonico", configuracoes.modoDaltonico, nomesDaltonismo[configuracoes.modoDaltonico]);
        atualizarCartao("leitor-sites", false, "Iniciar leitura");
        if (!configuracoes.lupaConteudo) lupaConteudo.hidden = true;
    }

    function focoEstaEmCampoDeTexto() {
        const ativo = document.activeElement;
        return ativo instanceof HTMLInputElement || ativo instanceof HTMLTextAreaElement || ativo instanceof HTMLSelectElement || ativo?.isContentEditable;
    }

    function focarPesquisa() {
        const campo = encontrarCampoPesquisa();
        if (campo) {
            campo.focus();
            if (typeof campo.select === "function") campo.select();
            anunciar("Campo de pesquisa selecionado.");
            return;
        }
        marcarFocoPesquisa();
        window.location.href = caminhoPublico("index.html");
    }

    function tratarAtalhos(evento) {
        if (!evento.shiftKey || evento.ctrlKey || evento.metaKey || evento.altKey || focoEstaEmCampoDeTexto()) return;
        const tecla = evento.key.toLowerCase();
        if (!["a", "l", "p"].includes(tecla)) return;
        evento.preventDefault();
        navegacaoPorTeclado = true;
        corpo.classList.add("zuppy-usando-teclado");
        if (tecla === "a") alternarPainel();
        if (tecla === "l") alternarVlibras();
        if (tecla === "p") focarPesquisa();
    }

    function mostrarIndicadorFoco(elemento) {
        if (!(elemento instanceof HTMLElement) || !navegacaoPorTeclado || elemento === corpo || elemento === documento) {
            indicadorFoco.hidden = true;
            return;
        }
        elementoFocoAtual = elemento;
        atualizarIndicadorFoco();
    }

    function atualizarIndicadorFoco() {
        if (!elementoFocoAtual || !navegacaoPorTeclado || !document.contains(elementoFocoAtual)) {
            indicadorFoco.hidden = true;
            return;
        }
        if (rafFoco) cancelAnimationFrame(rafFoco);
        rafFoco = requestAnimationFrame(() => {
            const retangulo = elementoFocoAtual.getBoundingClientRect();
            if (retangulo.width <= 0 || retangulo.height <= 0) {
                indicadorFoco.hidden = true;
                return;
            }
            const margem = 7;
            indicadorFoco.hidden = false;
            indicadorFoco.style.left = `${Math.max(4, retangulo.left - margem)}px`;
            indicadorFoco.style.top = `${Math.max(4, retangulo.top - margem)}px`;
            indicadorFoco.style.width = `${Math.min(window.innerWidth - 8, retangulo.width + margem * 2)}px`;
            indicadorFoco.style.height = `${retangulo.height + margem * 2}px`;
        });
    }

    botoesRecursos.forEach((botao) => botao.addEventListener("click", () => executarRecurso(botao.dataset.recursoAcessibilidade)));
    botaoAbrirPainel.addEventListener("click", abrirPainel);
    document.querySelectorAll("[data-abrir-acessibilidade]").forEach((botao) => botao.addEventListener("click", abrirPainel));
    botaoFecharPainel.addEventListener("click", fecharPainel);
    botaoLibras.addEventListener("click", alternarVlibras);
    botaoRestaurar.addEventListener("click", restaurarTudo);
    cabecalhoPainel.addEventListener("pointerdown", iniciarArrastePainel);
    cabecalhoPainel.addEventListener("pointermove", moverPainel);
    cabecalhoPainel.addEventListener("pointerup", finalizarArrastePainel);
    cabecalhoPainel.addEventListener("pointercancel", finalizarArrastePainel);

    document.addEventListener("keydown", (evento) => {
        tratarAtalhos(evento);
        if (evento.key === "Tab") {
            navegacaoPorTeclado = true;
            corpo.classList.add("zuppy-usando-teclado");
        }
        if (evento.key === "Escape" && painel.classList.contains("zuppy-painel-aberto")) fecharPainel();
        if ((configuracoes.guiaLeitura || configuracoes.mascaraLeitura) && ["ArrowUp", "ArrowDown"].includes(evento.key) && !focoEstaEmCampoDeTexto()) {
            evento.preventDefault();
            atualizarPosicaoLeitura(posicaoLeitura + (evento.key === "ArrowDown" ? 20 : -20));
        }
    });

    document.addEventListener("pointerdown", (evento) => {
        if (!evento.target.closest("#zuppyPainelAcessibilidade, #zuppyAbrirPainel")) {
            navegacaoPorTeclado = false;
            corpo.classList.remove("zuppy-usando-teclado");
            indicadorFoco.hidden = true;
        }
    });
    document.addEventListener("focusin", (evento) => {
        mostrarIndicadorFoco(evento.target);
        if (configuracoes.lupaConteudo && evento.target instanceof HTMLElement) {
            const retangulo = evento.target.getBoundingClientRect();
            mostrarLupaParaElemento(evento.target, retangulo.left, retangulo.bottom);
        }
    });
    document.addEventListener("focusout", () => window.setTimeout(() => {
        mostrarIndicadorFoco(document.activeElement);
        if (configuracoes.lupaConteudo && !document.activeElement?.closest?.(seletorLupa)) lupaConteudo.hidden = true;
    }, 0));
    document.addEventListener("pointermove", (evento) => {
        if (configuracoes.guiaLeitura || configuracoes.mascaraLeitura) atualizarPosicaoLeitura(evento.clientY);
        if (configuracoes.lupaConteudo) mostrarLupaParaElemento(evento.target, evento.clientX, evento.clientY);
    });
    document.addEventListener("pointerleave", () => {
        if (configuracoes.lupaConteudo) lupaConteudo.hidden = true;
    });
    window.addEventListener("scroll", atualizarIndicadorFoco, true);
    window.addEventListener("resize", () => {
        atualizarIndicadorFoco();
        atualizarPosicaoLeitura(posicaoLeitura);
        ajustarPainelNaTela();
    });
    window.addEventListener("beforeunload", () => window.speechSynthesis?.cancel());

    observadorConteudo = new MutationObserver((alteracoes) => {
        alteracoes.forEach((alteracao) => alteracao.addedNodes.forEach((no) => {
            if (!(no instanceof HTMLElement) || no.closest("#zuppyAcessibilidadeRaiz, [vw]")) return;
            if (no.matches(seletorTextos)) aplicarFonteEmElemento(no);
            no.querySelectorAll?.(seletorTextos).forEach(aplicarFonteEmElemento);
            if (configuracoes.esconderImagens) {
                ocultarImagens();
                atualizarConteudosAlternativos();
            }
        }));
    });
    observadorConteudo.observe(corpo, { childList: true, subtree: true });

    aplicarTodasConfiguracoes();
    inserirVlibras();
    observarBotaoVlibras();

    if (consumirFocoPesquisa()) window.setTimeout(focarPesquisa, 250);
});
