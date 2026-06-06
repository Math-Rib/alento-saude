export function initHomeAdmin() {

    const userProfile = document.querySelector('.user-profile');
    const dropdownMenu = document.getElementById("dropdownMenu");
    const btnHamburguer = document.getElementById('btn-menu-mobile');
    const menuCentral = document.querySelector('.menu-central');

    // Lógica do Dropdown do Usuário
    if (userProfile && dropdownMenu) {
        userProfile.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle("ativo");
            if (menuCentral) menuCentral.classList.remove('show');
        });
    }

    // Lógica do Menu Hambúrguer Mobile
    btnHamburguer.addEventListener('click', (event) => {
        event.stopPropagation();

        menuCentral.classList.add('show');

        const overlay = document.querySelector('.sidebar-overlay');

        if (dropdownMenu) {
            dropdownMenu.classList.remove('ativo');
        }
    });

    // Fecha os menus se clicar em qualquer outro lugar da tela
    window.addEventListener('click', (event) => {
        if (dropdownMenu && !event.target.closest('.user-dropdown')) {
            dropdownMenu.classList.remove("ativo");
        }

        if (menuCentral && btnHamburguer) {
            // Verifica se o clique NÃO foi no menu e NÃO foi no botão hambúrguer (ou ícone dentro dele)
            if (!menuCentral.contains(event.target) && !event.target.closest('#btn-menu-mobile')) {
                menuCentral.classList.remove('show');
            }
        }
    });
}