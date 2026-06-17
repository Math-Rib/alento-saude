let listaLogsOriginal = [];
let listaLogsFiltrados = [];
let paginaAtual = 1;
const registrosPorPagina = 10;

export function initLogsSistema() {
    const tabelaBody = document.getElementById('tabelaLogsBody');
    
    // Garante que o elemento existe antes de prosseguir
    if (!tabelaBody) {
        console.warn("Aguardando carregamento do elemento tabelaLogsBody...");
        setTimeout(initLogsSistema, 100);
        return;
    }

    // Carrega os logs e, só depois, configura as funcionalidades
    carregarLogs().then(() => {
        configurarMascaras();
        configurarEventosFiltro();
    });
}

async function carregarLogs() {
    try {
        const response = await fetch('/api/logs');
        if (!response.ok) throw new Error('Falha ao buscar logs');
        
        listaLogsOriginal = await response.json();
        listaLogsFiltrados = [...listaLogsOriginal];
        renderizarTabela(); 
    } catch (error) {
        console.error('Erro ao carregar logs:', error);
    }
}

function renderizarTabela(dados = listaLogsFiltrados) {
    const tabelaBody = document.getElementById('tabelaLogsBody');
    if (!tabelaBody) return;

    const inicio = (paginaAtual - 1) * registrosPorPagina;
    const fim = inicio + registrosPorPagina;
    const logsPaginados = dados.slice(inicio, fim);

    tabelaBody.innerHTML = '';

    logsPaginados.forEach(log => {
        const dataFormatada = log.data ? log.data.split('-').reverse().join('/') : '-';
        const horaFormatada = log.hora ? log.hora.substring(0, 5) : '-';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${log.id_log}</td>
            <td>${log.usuario_responsavel}</td>
            <td><span class="esp-badge">${log.acao}</span></td>
            <td>${log.tabela_afetada}</td>
            <td>${log.id_afetado || '-'}</td>
            <td>${log.descricao}</td>
            <td>${horaFormatada}</td>
            <td>${dataFormatada}</td>
            <td><button class="btn-view">📄</button></td>
        `;
        tabelaBody.appendChild(tr);
    });

    renderizarPaginacao(dados.length);
}

function filtrarLogs() {
    const termo = document.getElementById('inputBuscaLogs').value.toLowerCase();
    const dataMinimaStr = document.getElementById('inputDataLog').value; // Ex: 16/06/2026
    const horaMinimaStr = document.getElementById('inputHoraLog').value; // Ex: 14:00
    const acaoFiltro = document.getElementById('selectAcaoLog').value;

    // Função para converter "DD/MM/AAAA" e "HH:MM" em objeto Date
    const converterParaData = (dataStr, horaStr) => {
        if (!dataStr || dataStr.length !== 10) return null;
        const [d, m, a] = dataStr.split('/');
        const h = horaStr ? horaStr.split(':')[0] : '00';
        const min = horaStr ? horaStr.split(':')[1] : '00';
        return new Date(a, m - 1, d, h, min);
    };

    const dataMinima = converterParaData(dataMinimaStr, horaMinimaStr);

    listaLogsFiltrados = listaLogsOriginal.filter(log => {
        // 1. Busca textual
        const matchTexto = log.usuario_responsavel.toLowerCase().includes(termo) || 
                           log.descricao.toLowerCase().includes(termo);

        // 2. Filtro Temporal (Mínimo até o final)
        const [ano, mes, dia] = log.data.split('-');
        const dataLog = new Date(ano, mes - 1, dia, ...log.hora.split(':'));
        
        let matchTempo = true;
        if (dataMinima) {
            matchTempo = dataLog >= dataMinima;
        }

        // 3. Ação
        const matchAcao = acaoFiltro === 'todos' || log.acao === acaoFiltro;

        return matchTexto && matchTempo && matchAcao;
    });

    paginaAtual = 1;
    renderizarTabela(listaLogsFiltrados);
}

function configurarMascaras() {
    const inputData = document.getElementById('inputDataLog');
    const inputHora = document.getElementById('inputHoraLog');

    inputData?.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 8) v = v.slice(0, 8);
        if (v.length > 4) v = v.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
        else if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '$1/$2');
        e.target.value = v;
    });

    inputHora?.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 4) v = v.slice(0, 4);
        if (v.length > 2) v = v.replace(/(\d{2})(\d+)/, '$1:$2');
        e.target.value = v;
    });
}

function configurarEventosFiltro() {
    document.getElementById('inputBuscaLogs')?.addEventListener('input', filtrarLogs);
    document.getElementById('inputDataLog')?.addEventListener('input', filtrarLogs);
    document.getElementById('inputHoraLog')?.addEventListener('input', filtrarLogs);
    document.getElementById('selectAcaoLog')?.addEventListener('change', filtrarLogs);
}

function renderizarPaginacao(totalItems) {
    const container = document.getElementById('paginacaoContainer');
    const totalPaginas = Math.ceil(totalItems / registrosPorPagina) || 1;
    
    if (!container) return;
    
    container.innerHTML = `
        <button class="btn-paginacao" ${paginaAtual === 1 ? 'disabled' : ''} onclick="window.mudarPagina(-1)">
            <i class="fa-solid fa-chevron-left"></i> Anterior
        </button>
        <span class="info-paginacao">Página ${paginaAtual} de ${totalPaginas}</span>
        <button class="btn-paginacao" ${paginaAtual >= totalPaginas ? 'disabled' : ''} onclick="window.mudarPagina(1)">
            Próxima <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;
}

window.mudarPagina = (direcao) => {
    paginaAtual += direcao;
    renderizarTabela(listaLogsFiltrados);
};