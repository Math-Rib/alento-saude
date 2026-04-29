export function initHistoricoPaciente() {
    const userProfile = document.querySelector('.user-profile');
    const dropdownMenu = document.getElementById("dropdownMenu");

    const btnHamburguer = document.getElementById('btn-menu-mobile');
    const menuCentral = document.querySelector('.menu-central');

    if (userProfile && dropdownMenu) {
        userProfile.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle("ativo");

            // Fecha o menu mobile se ele estiver aberto
            if (menuCentral) menuCentral.classList.remove('show');
        });
    }

    if (btnHamburguer && menuCentral) {
        btnHamburguer.addEventListener('click', (event) => {
            event.stopPropagation();
            menuCentral.classList.toggle('show');
            // Fecha o dropdown de perfil se abrir o mobile
            if (dropdownMenu) dropdownMenu.classList.remove('ativo');
        });
    }

    window.addEventListener('click', (event) => {
        // Fecha o Menu Perfil Dropdown
        if (dropdownMenu && !event.target.closest('.user-dropdown')) {
            dropdownMenu.classList.remove("ativo");
        }

        // Fecha o Menu Hamburguer
        if (menuCentral && !event.target.closest('.menu-central') && !event.target.closest('.btn-hamburguer-custom')) {
            menuCentral.classList.remove('show');
        }
    });

    /* Interação da Paginação */
    const configurarPaginacao = (idPrev, idNext, seletorNums) => {
        const prev = document.getElementById(idPrev);
        const next = document.getElementById(idNext);
        const nums = document.querySelectorAll(seletorNums);

        if (!prev || !next || nums.length === 0) return;

        const atualizarEstado = (elementoClicado) => {
            nums.forEach(n => n.classList.remove('active'));
            elementoClicado.classList.add('active');

            const index = Array.from(nums).indexOf(elementoClicado);

            prev.disabled = (index === 0);
            next.disabled = (index === nums.length - 1);
            [prev, next].forEach(btn => {
                btn.style.opacity = btn.disabled ? "0.5" : "1";
                btn.style.cursor = btn.disabled ? "not-allowed" : "pointer";
                btn.style.pointerEvents = btn.disabled ? "none" : "auto";
            });
        };

        nums.forEach(num => {
            num.onclick = (e) => {
                e.preventDefault();
                atualizarEstado(num);
            };
        });

        // Evento Próximo
        next.onclick = (e) => {
            e.preventDefault();
            const atual = Array.from(nums).find(n => n.classList.contains('active'));
            const index = Array.from(nums).indexOf(atual);
            if (index < nums.length - 1) atualizarEstado(nums[index + 1]);
        };

        // Evento Anterior
        prev.onclick = (e) => {
            e.preventDefault();
            const atual = Array.from(nums).find(n => n.classList.contains('active'));
            const index = Array.from(nums).indexOf(atual);
            if (index > 0) atualizarEstado(nums[index - 1]);
        };

        const inicial = Array.from(nums).find(n => n.classList.contains('active')) || nums[0];
        atualizarEstado(inicial);
    };

    configurarPaginacao('prev-hist', 'next-hist', '.paginacao-historico-numerica .num-pag');
    configurarPaginacao('prev-bib', 'next-bib', '.paginacao-biblioteca-numerica .num-pag');

}