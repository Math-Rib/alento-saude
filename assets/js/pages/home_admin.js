export function initHomeAdmin() {

    const userProfile = document.querySelector('.user-profile');
    const dropdownMenu = document.getElementById("dropdownMenu");
    const btnHamburguer = document.getElementById('btn-menu-mobile');
    const menuCentral = document.querySelector('.menu-central');
    const btnLogout = document.getElementById('btn-logout');

    // Lógica do Dropdown do Usuário
    if (userProfile && dropdownMenu) {
        userProfile.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle("ativo");
            if (menuCentral) menuCentral.classList.remove('show');
        });
    }

    // Lógica do Botão de Sair (Logout)
    if (btnLogout) {
        btnLogout.addEventListener('click', (event) => {
            sessionStorage.clear();
            localStorage.clear();
        });
    }

    // CORREÇÃO 1: Envolve o menu hambúrguer em um IF de segurança
    if (btnHamburguer && menuCentral) {
        btnHamburguer.addEventListener('click', (event) => {
            event.stopPropagation();
            menuCentral.classList.add('show');
            if (dropdownMenu) {
                dropdownMenu.classList.remove('ativo');
            }
        });
    }

    // CORREÇÃO 2: Garante que o ouvinte global da window não quebre se os elementos não existirem
    window.addEventListener('click', (event) => {
        if (dropdownMenu && !event.target.closest('.user-dropdown')) {
            dropdownMenu.classList.remove("ativo");
        }

        if (menuCentral && btnHamburguer) {
            if (!menuCentral.contains(event.target) && !event.target.closest('#btn-menu-mobile')) {
                menuCentral.classList.remove('show');
            }
        }
    });
}