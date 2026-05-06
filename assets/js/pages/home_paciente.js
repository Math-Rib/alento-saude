export function initHomePaciente() {
    // Verifica se os elementos essenciais da Home existem na tela atual
    const calendarioContainer = document.getElementById("dias-calendario");
    const sidebarElement = document.getElementById('sidebar-perfil');

    if (calendarioContainer) {
        initCalendario();
    }
    
    if (sidebarElement) {
        initSidebar();
    }
}

function initCalendario() {
    const mesAno = document.getElementById("mes-ano");
    const diasContainer = document.getElementById("dias-calendario");
    const btnAnterior = document.getElementById("mes-anterior");
    const btnProximo = document.getElementById("mes-proximo");

    // Early return se os botões não existirem (evita erro no addEventListener)
    if (!mesAno || !diasContainer || !btnAnterior || !btnProximo) return;

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

        // Dias do mês anterior
        for (let x = indicePrimeiroDia; x > 0; x--) {
            diasHtml += `<div class="dia mes-diferente">${ultimoDiaMesAnterior - x + 1}</div>`;
        }

        // Dias do mês atual
        const hoje = new Date();
        for (let i = 1; i <= ultimoDiaMes; i++) {
            let classes = "dia";
            if (i === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
                classes += " ativo";
            }
            // Exemplo de lógica de consulta
            if (i === 15) classes += " consulta-marcada";
            
            diasHtml += `<div class="${classes}">${i}</div>`;
        }

        // Dias do próximo mês
        const celulasRestantes = 42 - (indicePrimeiroDia + ultimoDiaMes);
        for (let j = 1; j <= celulasRestantes; j++) {
            diasHtml += `<div class="dia mes-diferente">${j}</div>`;
        }

        diasContainer.innerHTML = diasHtml;
    }

    // Importante: Remova listeners antigos se estiver em uma SPA para evitar duplicidade
    // Se for multipáginas comum, apenas o código abaixo resolve:
    btnAnterior.onclick = () => { 
        dataAtual.setMonth(dataAtual.getMonth() - 1); 
        renderizar(); 
    };
    btnProximo.onclick = () => { 
        dataAtual.setMonth(dataAtual.getMonth() + 1); 
        renderizar(); 
    };

    renderizar();
}

function initSidebar() {
    const btnAbrir = document.getElementById('btn-abrir-perfil');
    const sidebar = document.getElementById('sidebar-perfil');
    const overlay = document.getElementById('overlay-perfil');

    if (!btnAbrir || !sidebar || !overlay) return;

    // Usar uma função nomeada ajuda a manter o código limpo
    const toggleMenu = () => {
        sidebar.classList.toggle('ativo');
        overlay.classList.toggle('ativo');
    };

    btnAbrir.onclick = toggleMenu;
    overlay.onclick = toggleMenu;
}