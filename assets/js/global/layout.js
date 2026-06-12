export function initGlobalLayout() {
    // Captura os elementos do Header (globais em todas as páginas)
    const userDropdown = document.querySelector('.user-dropdown') || document.querySelector('.user-profile');
    const dropdownMenu = document.getElementById("dropdownMenu");
    const btnHamburguer = document.getElementById('btn-menu-mobile');
    const menuCentral = document.querySelector('.menu-central');
    const btnLogout = document.getElementById('btn-logout');

    // 1. Lógica do Dropdown do Usuário
    if (userDropdown && dropdownMenu) {
        userDropdown.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que o clique se espalhe para a window
            
            dropdownMenu.classList.toggle("ativo");
            
            // Fecha o menu móvel se ele estiver aberto
            if (menuCentral) menuCentral.classList.remove('show');
        });
    }

    // 2. Lógica do Botão de Sair (Logout)
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.clear();
            localStorage.clear();
            // Redireciona para o index/login após limpar os dados
            window.location.href = "/index.html"; 
        });
    }

    // 3. Lógica do Botão Hambúrguer Mobile
    if (btnHamburguer && menuCentral) {
        btnHamburguer.addEventListener('click', (event) => {
            event.stopPropagation();
            
            menuCentral.classList.add('show');
            
            // Fecha o dropdown se ele estiver aberto
            if (dropdownMenu) {
                dropdownMenu.classList.remove('ativo');
            }
        });
    }

    // 4. Ouvinte global para fechar os menus ao clicar fora
    window.addEventListener('click', (event) => {
        // Se clicar fora do dropdown, fecha ele
        if (dropdownMenu && !event.target.closest('.user-dropdown') && !event.target.closest('.user-profile')) {
            dropdownMenu.classList.remove("ativo");
        }

        // Se clicar fora do menu hambúrguer e fora do botão hambúrguer, fecha ele
        if (menuCentral && btnHamburguer) {
            if (!menuCentral.contains(event.target) && !event.target.closest('#btn-menu-mobile')) {
                menuCentral.classList.remove('show');
            }
        }
    });
}