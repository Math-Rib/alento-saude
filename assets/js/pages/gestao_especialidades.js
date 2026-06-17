// Variáveis com escopo no módulo para não vazar para outros arquivos
let listaEspecialidadesOriginal = [];
let paginaAtual = 1;
const registrosPorPagina = 3;

export function initGestaoEspecialidades() {
    // Cadastro
    const btnAbrir = document.getElementById('btnAbrirCadastroEspecialidade');
    const modalWrapper = document.getElementById('espModalWrapper');
    const btnFecharX = document.getElementById('espModalCloseX');
    const btnCancelar = document.getElementById('espBtnCancelar');
    const formCadastro = document.getElementById('espFormCadastro');

    // Edição e Exclusão
    const editModalWrapper = document.getElementById('editModalWrapper');
    const editModalCloseX = document.getElementById('editModalCloseX');
    const editBtnCancelar = document.getElementById('editBtnCancelar');
    const editForm = document.getElementById('editFormCadastro');
    const deleteModalWrapper = document.getElementById('deleteModalWrapper');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    const btnCancelDelete = document.getElementById('btnCancelDelete');

    // Filtros
    const inputBusca = document.getElementById('inputBuscaEspecialidade');
    const selectStatus = document.getElementById('selectFiltroStatus');
    const inputValorMin = document.getElementById('inputValorMin');
    const inputValorMax = document.getElementById('inputValorMax');
    const inputTempoMax = document.getElementById('inputTempoMax');

    // Paginação Container
    const paginacaoContainer = document.getElementById('paginacaoContainer');

    carregarEspecialidadesBanco();

    // Eventos de Busca e Filtro
    const resetarPaginaEFiltrar = () => { paginaAtual = 1; aplicarFiltros(); };
    if (inputBusca) inputBusca.addEventListener('input', resetarPaginaEFiltrar);
    if (selectStatus) selectStatus.addEventListener('change', resetarPaginaEFiltrar);
    if (inputValorMin) inputValorMin.addEventListener('input', resetarPaginaEFiltrar);
    if (inputValorMax) inputValorMax.addEventListener('input', resetarPaginaEFiltrar);
    if (inputTempoMax) inputTempoMax.addEventListener('input', resetarPaginaEFiltrar);

    // Eventos de Paginação (Delegado ao container para não sujar o window)
    if (paginacaoContainer) {
        paginacaoContainer.addEventListener('click', (e) => {
            if (e.target.closest('.btn-paginacao')) {
                const direcao = parseInt(e.target.closest('.btn-paginacao').dataset.direcao);
                paginaAtual += direcao;
                aplicarFiltros();
            }
        });
    }

    // Modais Cadastro
    if (btnAbrir) btnAbrir.addEventListener('click', () => modalWrapper?.classList.add('esp-modal-active'));
    if (btnFecharX) btnFecharX.addEventListener('click', () => { modalWrapper?.classList.remove('esp-modal-active'); formCadastro?.reset(); });
    if (btnCancelar) btnCancelar.addEventListener('click', () => { modalWrapper?.classList.remove('esp-modal-active'); formCadastro?.reset(); });

    // Edição Submit
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dadosEdicao = {
                id: document.getElementById('editInputId').value,
                titulo: document.getElementById('editInputTitulo').value,
                descricao: document.getElementById('editInputDescricao').value,
                tempoMedio: document.getElementById('editInputTempo').value,
                valor: document.getElementById('editInputValor').value,
                status: document.getElementById('editSelectStatus')?.value || 'ativo'
            };

            const response = await fetch('/editarEspecialidade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosEdicao)
            });

            if (response.ok) {
                editModalWrapper?.classList.remove('esp-modal-active');
                await carregarEspecialidadesBanco();
            }
        });
    }

    // Tabela: Delegação para editar/deletar
    document.getElementById('tabelaEspecialidadesBody')?.addEventListener('click', (e) => {
        const btnEdit = e.target.closest('.btn-edit');
        const btnDelete = e.target.closest('.btn-delete');
        if (btnEdit) abrirModalEdicao(btnEdit.dataset.id);
        if (btnDelete) {
            document.getElementById('deleteInputId').value = btnDelete.dataset.id;
            deleteModalWrapper?.classList.add('esp-modal-active');
        }
    });

    // Exclusão Confirmar
    btnConfirmDelete?.addEventListener('click', async () => {
        const id = document.getElementById('deleteInputId').value;
        const response = await fetch('/excluirEspecialidade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        if (response.ok) {
            deleteModalWrapper?.classList.remove('esp-modal-active');
            await carregarEspecialidadesBanco();
        }
    });

    // Fechar Modais
    [editModalCloseX, editBtnCancelar, btnCancelDelete].forEach(btn => 
        btn?.addEventListener('click', () => {
            editModalWrapper?.classList.remove('esp-modal-active');
            deleteModalWrapper?.classList.remove('esp-modal-active');
        })
    );
}

async function carregarEspecialidadesBanco() {
    try {
        const response = await fetch('/api/especialidades');
        listaEspecialidadesOriginal = await response.json();
        aplicarFiltros();
    } catch (error) { console.error('Erro:', error); }
}

function aplicarFiltros() {
    const termo = document.getElementById('inputBuscaEspecialidade')?.value.toLowerCase() || '';
    const statusFiltro = document.getElementById('selectFiltroStatus')?.value || 'todos';
    const valorMin = parseFloat(document.getElementById('inputValorMin')?.value) || 0;
    const valorMax = parseFloat(document.getElementById('inputValorMax')?.value) || Infinity;
    const tempoMax = parseInt(document.getElementById('inputTempoMax')?.value) || Infinity;

    const listaFiltrada = listaEspecialidadesOriginal.filter(esp => {
        const valorConsulta = parseFloat(esp.valorConsulta) || 0;
        const tempoConsulta = parseInt(esp.tempoMedio) || 0;
        return (esp.nome.toLowerCase().includes(termo) || esp.descricao?.toLowerCase().includes(termo)) &&
               (statusFiltro === 'todos' || esp.status === statusFiltro) &&
               (valorConsulta >= valorMin && valorConsulta <= valorMax) &&
               (tempoConsulta <= tempoMax);
    });
    renderizarTabela(listaFiltrada);
}

function renderizarTabela(dados) {
    const tbody = document.getElementById('tabelaEspecialidadesBody');
    if (!tbody) return;
    const totalPaginas = Math.ceil(dados.length / registrosPorPagina) || 1;
    const inicio = (paginaAtual - 1) * registrosPorPagina;
    const dadosPagina = dados.slice(inicio, inicio + registrosPorPagina);

    tbody.innerHTML = dadosPagina.length ? '' : '<tr><td colspan="7" style="text-align:center;">Nenhuma especialidade.</td></tr>';
    dadosPagina.forEach(esp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${esp.id_especialidade}</td><td><strong>${esp.nome}</strong></td><td>${esp.descricao || '---'}</td><td>${esp.tempoMedio ? esp.tempoMedio + ' min' : '---'}</td><td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(esp.valorConsulta || 0)}</td><td><div class="status"><div class="dot ${esp.status === 'ativo' ? 'dot-green' : 'dot-red'}"></div>${esp.status}</div></td><td><div class="actions"><button class="btn-action btn-edit" data-id="${esp.id_especialidade}"><i class="fa-solid fa-pen"></i></button><button class="btn-action btn-delete" data-id="${esp.id_especialidade}"><i class="fa-solid fa-trash-can"></i></button></div></td>`;
        tbody.appendChild(tr);
    });
    renderizarPaginacao(totalPaginas);
}

function renderizarPaginacao(totalPaginas) {
    const container = document.getElementById('paginacaoContainer');
    if (!container) return;
    container.innerHTML = `
        <button class="btn-paginacao" ${paginaAtual === 1 ? 'disabled' : ''} data-direcao="-1"> <i class="fa-solid fa-chevron-left"></i> Anterior</button>
        <span class="info-paginacao">Página ${paginaAtual} de ${totalPaginas}</span>
        <button class="btn-paginacao" ${paginaAtual >= totalPaginas ? 'disabled' : ''} data-direcao="1">Próxima <i class="fa-solid fa-chevron-right"></i></button>
    `;
}

function abrirModalEdicao(id) {
    const esp = listaEspecialidadesOriginal.find(item => item.id_especialidade == id);
    if (!esp) return;
    document.getElementById('editInputId').value = esp.id_especialidade;
    document.getElementById('editInputTitulo').value = esp.nome;
    document.getElementById('editInputDescricao').value = esp.descricao || '';
    document.getElementById('editInputTempo').value = esp.tempoMedio || '';
    document.getElementById('editInputValor').value = esp.valorConsulta || '';
    document.getElementById('editSelectStatus').value = esp.status || 'ativo';
    document.getElementById('editModalWrapper')?.classList.add('esp-modal-active');
}