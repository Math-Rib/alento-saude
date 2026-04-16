export function initHomePaciente() {
    document.addEventListener('DOMContentLoaded', () => {
        initCalendario();
        initSidebar();
    });

    /**
     * Lógica do Calendário
     */
    function initCalendario() {
        const mesAno = document.getElementById("mes-ano");
        const diasContainer = document.getElementById("dias-calendario");
        const btnAnterior = document.getElementById("mes-anterior");
        const btnProximo = document.getElementById("mes-proximo");

        let dataAtual = new Date();

        function renderizar() {
            dataAtual.setDate(1);
            const mes = dataAtual.getMonth();
            const ano = dataAtual.getFullYear();
            const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

            mesAno.innerText = `${meses[mes]} ${ano}`;

            const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();
            const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();

            let indicePrimeiroDia = dataAtual.getDay() - 1;
            if (indicePrimeiroDia === -1) indicePrimeiroDia = 6;

            let diasHtml = "";

            // Preenche dias do mês anterior
            for (let x = indicePrimeiroDia; x > 0; x--) {
                diasHtml += `<div class="dia mes-diferente">${ultimoDiaMesAnterior - x + 1}</div>`;
            }

            // Preenche dias do mês atual
            for (let i = 1; i <= ultimoDiaMes; i++) {
                let classes = "dia";
                if (i === new Date().getDate() && mes === new Date().getMonth() && ano === new Date().getFullYear()) classes += " ativo";
                if (i === 15) classes += " consulta-marcada"; // Exemplo manual
                diasHtml += `<div class="${classes}">${i}</div>`;
            }

            // Preenche dias do próximo mês
            const celulasRestantes = 42 - (indicePrimeiroDia + ultimoDiaMes);
            for (let j = 1; j <= celulasRestantes; j++) {
                diasHtml += `<div class="dia mes-diferente">${j}</div>`;
            }

            diasContainer.innerHTML = diasHtml;
        }

        btnAnterior.addEventListener("click", () => { dataAtual.setMonth(dataAtual.getMonth() - 1); renderizar(); });
        btnProximo.addEventListener("click", () => { dataAtual.setMonth(dataAtual.getMonth() + 1); renderizar(); });

        renderizar();
    }

    /**
     * Lógica do Menu Lateral (Sidebar)
     */
    function initSidebar() {
        const btnAbrir = document.getElementById('btn-abrir-perfil');
        const sidebar = document.getElementById('sidebar-perfil');
        const overlay = document.getElementById('overlay-perfil');

        function toggleMenu() {
            sidebar.classList.toggle('ativo');
            overlay.classList.toggle('ativo');
        }

        if (btnAbrir) btnAbrir.addEventListener('click', toggleMenu);
        if (overlay) overlay.addEventListener('click', toggleMenu);
    }

}