// pega os elementos do carrossel no html
const track = document.getElementById("carrosselTrack");
const btnAvancar = document.getElementById("btnAvancar");
const btnVoltar = document.getElementById("btnVoltar");

// trava para evitar cliques rapidos enquanto anima
let animando = false;

// calcula a distancia do deslocamento
function pegarDistanciaCard() {
    const card = document.querySelector(".card-banner");
    const gap = 24; // espaco entre os cards
    return card.offsetWidth + gap;
}

// passa pro proximo banner
function avancarCarrossel() {
    if (animando) return;
    animando = true;

    const distancia = pegarDistanciaCard();

    track.style.transition = "transform 0.45s ease";
    track.style.transform = `translateX(-${distancia}px)`;

    // reordena os elementos ao terminar a animacao
    track.addEventListener("transitionend", function finalizar() {
        track.appendChild(track.firstElementChild);

        track.style.transition = "none";
        track.style.transform = "translateX(0)";

        animando = false;
        track.removeEventListener("transitionend", finalizar);
    });
}

// volta pro banner anterior
function voltarCarrossel() {
    if (animando) return;
    animando = true;

    const distancia = pegarDistanciaCard();

    // joga o ultimo card pro inicio instantaneamente
    track.style.transition = "none";
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    track.style.transform = `translateX(-${distancia}px)`;

    // delay curto pro navegador processar a troca e animar de volta
    setTimeout(() => {
        track.style.transition = "transform 0.45s ease";
        track.style.transform = "translateX(0)";
    }, 20);

    // destrava ao terminar
    track.addEventListener("transitionend", function finalizar() {
        animando = false;
        track.removeEventListener("transitionend", finalizar);
    });
}

// eventos dos botoes
btnAvancar.addEventListener("click", avancarCarrossel);
btnVoltar.addEventListener("click", voltarCarrossel);

// passa sozinho a cada 3.5s
setInterval(avancarCarrossel, 3500);