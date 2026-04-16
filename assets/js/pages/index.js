export function initIndex() {
    // Seletores do Modal Saiba Mais
    const modalSaibaMais = document.getElementById("modalSaibaMais");
    const btnAbrirSaibaMais = document.querySelector(".btn-saiba-mais");
    const btnFecharSaibaMais = document.getElementById("closeSaibaMais");

    // Seletores Ajuda
    const modalAjuda = document.getElementById("modalAjuda");
    const btnAbrirAjuda = document.querySelector(".top-bar-item button"); 
    const btnFecharAjuda = document.getElementById("closeAjuda");

    // Abrir/Fechar Modal Saiba Mais
    if (btnAbrirSaibaMais && modalSaibaMais) {
        btnAbrirSaibaMais.onclick = () => modalSaibaMais.style.display = "flex";
        btnFecharSaibaMais.onclick = () => modalSaibaMais.style.display = "none";
    }

    if (btnAbrirAjuda && modalAjuda) {
        btnAbrirAjuda.onclick = (e) => {
            e.preventDefault();
            modalAjuda.style.display = "flex";
        };
        btnFecharAjuda.onclick = () => modalAjuda.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modalSaibaMais) modalSaibaMais.style.display = "none";
        if (event.target == modalAjuda) modalAjuda.style.display = "none";
    };

}

// Inicializa a lógica da página
document.addEventListener("DOMContentLoaded", initIndex);
