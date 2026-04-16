export function initDarkMode() {
    const toggle = document.getElementById('toggle-dark-mode');
    const icon = document.getElementById('img-modo-noturno');
    const body = document.body;

    if(!toggle || !icon) return;

    /* Caminho dos Icones */ 
    const darkIcon = "/img/icone_modo_noturno.png";
    const lightIcon = "/img/icone_modo_claro.png"

    /* Carrega a preferência salva no LocalStorage*/
    const isDark = localStorage.getItem('dark-mode') === "true";

    if (isDark) {
        body.classList.add("dark-mode");
        icon.src = lightIcon; // Caminho do icone do sol
    } else {
        icon.src = darkIcon; // Caminho do icone da lua
    }

    toggle.addEventListener('click', () =>{
        body.classList.toggle('dark-mode');

        const isNowDark = body.classList.contains("dark-mode");

        /* Salva o modo no LocalStorage */ 
        localStorage.setItem("dark-mode", isNowDark);

        /* Troca a imagem */
        icon.src = isNowDark? lightIcon : darkIcon;
    });
}