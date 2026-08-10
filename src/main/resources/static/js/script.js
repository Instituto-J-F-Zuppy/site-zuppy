const track = document.getElementById("carrosselTrack");
const btnAvancar = document.getElementById("btnAvancar");
const btnVoltar = document.getElementById("btnVoltar");

let animando = false;

function pegarDistanciaCard() {
    const card = document.querySelector(".card-banner");
    const gap = 24;

    return card.offsetWidth + gap;
}

function avancarCarrossel() {
    if (animando) return;

    animando = true;

    const distancia = pegarDistanciaCard();

    track.style.transition = "transform 0.45s ease";
    track.style.transform = `translateX(-${distancia}px)`;

    track.addEventListener("transitionend", function finalizar() {
        track.appendChild(track.firstElementChild);

        track.style.transition = "none";
        track.style.transform = "translateX(0)";

        animando = false;

        track.removeEventListener("transitionend", finalizar);
    });
}

function voltarCarrossel() {
    if (animando) return;

    animando = true;

    const distancia = pegarDistanciaCard();

    track.style.transition = "none";
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    track.style.transform = `translateX(-${distancia}px)`;

    setTimeout(() => {
        track.style.transition = "transform 0.45s ease";
        track.style.transform = "translateX(0)";
    }, 20);

    track.addEventListener("transitionend", function finalizar() {
        animando = false;
        track.removeEventListener("transitionend", finalizar);
    });
}

btnAvancar.addEventListener("click", avancarCarrossel);
btnVoltar.addEventListener("click", voltarCarrossel);

setInterval(avancarCarrossel, 3500);