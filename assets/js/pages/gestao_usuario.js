export function initGestaoUsuarios() {

    const tabelaBody = document.getElementById('tabelaUsuarios');
    if (!tabelaBody) return;

    // ===== Seletores =====
    const inputBusca            = document.getElementById('inputBusca');
    const filtroData            = document.getElementById('filtroData');
    const filtroPerfil          = document.getElementById('filtroPerfil');
    const filtroStatus          = document.getElementById('filtroStatus');
    const paginacao             = document.getElementById('paginacaoUsuarios');
    const btnAbrirCadastro      = document.getElementById('btnAbrirCadastro');

    // Modal Cadastro
    const modalCadastro             = document.getElementById('modalCadastroUsuario');
    const formCadastro              = document.getElementById('formCadastroUsuario');
    const alertCadastro             = document.getElementById('alertCadastro');
    const selectPerfilCadastro      = document.getElementById('cadPerfil');
    const inputDataCadastro         = document.getElementById('cadDataCadastro');
    const inputDataNascCadastro     = document.getElementById('cadDataNascimento');
    const btnGerarSenha             = document.getElementById('btnGerarSenha');

    // Modal Editar
    const modalEditar               = document.getElementById('modalEditarUsuario');
    const formEditar                = document.getElementById('formEditarUsuario');
    const alertEditar               = document.getElementById('alertEditar');
    const selectPerfilEditar        = document.getElementById('editPerfil');
    const inputDataNascEditar       = document.getElementById('editDataNascimento');

    // Modal Excluir
    const modalExcluir              = document.getElementById('modalExcluirUsuario');
    const alertExcluir              = document.getElementById('alertExcluir');
    const nomeUsuarioExcluir        = document.getElementById('nomeUsuarioExcluir');
    const btnConfirmarExclusao      = document.getElementById('btnConfirmarExclusao');

    // Modal Detalhes
    const modalDetalhes             = document.getElementById('modalDetalhesUsuario');
    const detalhesConteudo          = document.getElementById('detalhesConteudo');

    // ===== Estado =====
    let usuarios           = [];
    let funcoes            = [];
    let paginaAtual        = 1;
    let usuarioParaExcluir = null;
    let debounceBusca      = null;
    const ITENS_POR_PAGINA = 6;

    init();

    // ===== Init =====
    async function init() {
        configurarFechamentoModais();
        configurarMascaras();
        configurarFiltros();

        if (btnAbrirCadastro) btnAbrirCadastro.addEventListener('click', abrirModalCadastro);

        if (btnGerarSenha) {
            btnGerarSenha.addEventListener('click', () => {
                document.getElementById('cadSenha').value = gerarSenhaAleatoria();
            });
        }

        if (formCadastro)        formCadastro.addEventListener('submit', enviarCadastro);
        if (formEditar)          formEditar.addEventListener('submit', enviarEdicao);
        if (btnConfirmarExclusao) btnConfirmarExclusao.addEventListener('click', confirmarExclusao);

        await carregarFuncoes();
        await carregarUsuarios();
    }

    // ===== API =====
    async function carregarFuncoes() {
        try {
            const resp = await fetch('/api/admin/funcoes');
            if (!resp.ok) throw new Error('Erro ao buscar perfis');
            funcoes = await resp.json();
            preencherSelectPerfis(filtroPerfil, true);
            preencherSelectPerfis(selectPerfilCadastro, false);
            preencherSelectPerfis(selectPerfilEditar, false);
        } catch (error) {
            console.error('Erro ao carregar funções:', error);
        }
    }

    function preencherSelectPerfis(select, comOpcaoTodos) {
        if (!select) return;
        const valorAtual = select.value;
        select.innerHTML = `<option value="">${comOpcaoTodos ? 'Todos' : 'Selecione'}</option>`;
        funcoes.forEach(funcao => {
            const opt = document.createElement('option');
            opt.value = funcao.id_funcao;
            opt.textContent = capitalizar(funcao.nome);
            select.appendChild(opt);
        });
        select.value = valorAtual;
    }

    async function carregarUsuarios() {
        try {
            const params = new URLSearchParams();
            if (inputBusca?.value.trim())  params.append('busca',   inputBusca.value.trim());
            if (filtroData?.value)         params.append('periodo',  filtroData.value);
            if (filtroPerfil?.value)       params.append('perfil',   filtroPerfil.value);
            if (filtroStatus?.value)       params.append('status',   filtroStatus.value);

            tabelaBody.innerHTML = `<tr><td colspan="8" class="text-center">Carregando...</td></tr>`;
            const resp = await fetch(`/api/admin/usuarios?${params.toString()}`);
            if (!resp.ok) throw new Error('Erro ao buscar usuários');
            usuarios = await resp.json();
            paginaAtual = 1;
            renderizarTabela();
        } catch (error) {
            console.error(error);
            tabelaBody.innerHTML = `<tr><td colspan="8" class="text-center">Erro ao carregar dados.</td></tr>`;
        }
    }

    // ===== Renderização =====
    function renderizarTabela() {
        tabelaBody.innerHTML = '';

        if (usuarios.length === 0) {
            tabelaBody.innerHTML = `<tr><td colspan="8" class="text-center">Nenhum registro encontrado.</td></tr>`;
            renderizarPaginacao();
            return;
        }

        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        usuarios.slice(inicio, inicio + ITENS_POR_PAGINA).forEach(usuario => {
            const ativo = isAtivo(usuario.status_conta);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${escapeHtml(usuario.nome_completo)}</td>
                <td>${escapeHtml(usuario.email)}</td>
                <td>${escapeHtml(usuario.cpf || '-')}</td>
                <td>${escapeHtml(usuario.telefone || '-')}</td>
                <td>${formatarData(usuario.criado_em)}</td>
                <td>${capitalizar(usuario.perfil || '-')}</td>
                <td>
                    <div class="status">
                        <div class="dot ${ativo ? 'dot-green' : 'dot-red'}"></div>
                        ${ativo ? 'Ativo' : 'Inativo'}
                    </div>
                </td>
                <td>
                    <div class="actions">
                        <button class="btn-action btn-list"   data-id="${usuario.id_usuario}" title="Detalhes"><i class="fa-solid fa-list-ul"></i></button>
                        <button class="btn-action btn-edit"   data-id="${usuario.id_usuario}" title="Editar"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-action btn-delete" data-id="${usuario.id_usuario}" data-nome="${escapeHtml(usuario.nome_completo)}" title="Excluir"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            `;
            tabelaBody.appendChild(tr);
        });

        tabelaBody.querySelectorAll('.btn-list').forEach(btn =>
            btn.addEventListener('click', () => abrirModalDetalhes(btn.dataset.id)));
        tabelaBody.querySelectorAll('.btn-edit').forEach(btn =>
            btn.addEventListener('click', () => abrirModalEdicao(btn.dataset.id)));
        tabelaBody.querySelectorAll('.btn-delete').forEach(btn =>
            btn.addEventListener('click', () => abrirModalExclusao(btn.dataset.id, btn.dataset.nome)));

        renderizarPaginacao();
    }

    function renderizarPaginacao() {
        if (!paginacao) return;
        paginacao.innerHTML = '';
        const total = Math.ceil(usuarios.length / ITENS_POR_PAGINA) || 1;

        const prev = document.createElement('span');
        prev.textContent = '<';
        prev.addEventListener('click', () => { if (paginaAtual > 1) { paginaAtual--; renderizarTabela(); } });
        paginacao.appendChild(prev);

        for (let i = 1; i <= total; i++) {
            const span = document.createElement('span');
            span.textContent = i;
            if (i === paginaAtual) span.classList.add('active');
            span.addEventListener('click', () => { paginaAtual = i; renderizarTabela(); });
            paginacao.appendChild(span);
        }

        const next = document.createElement('span');
        next.textContent = '>';
        next.addEventListener('click', () => { if (paginaAtual < total) { paginaAtual++; renderizarTabela(); } });
        paginacao.appendChild(next);
    }

    // ===== Filtros =====
    function configurarFiltros() {
        if (inputBusca) {
            inputBusca.addEventListener('input', () => {
                clearTimeout(debounceBusca);
                debounceBusca = setTimeout(carregarUsuarios, 400);
            });
        }
        [filtroData, filtroPerfil, filtroStatus].forEach(sel => {
            if (sel) sel.addEventListener('change', carregarUsuarios);
        });
    }

    // ===== Modal Cadastro =====
    function abrirModalCadastro() {
        formCadastro.reset();
        esconderAlerta(alertCadastro);
        if (inputDataCadastro) inputDataCadastro.value = formatarData(new Date().toISOString());
        abrirModal(modalCadastro);
    }

    async function enviarCadastro(event) {
        event.preventDefault();
        esconderAlerta(alertCadastro);

        const dados = {
            nome_completo:   document.getElementById('cadNome').value.trim(),
            email:           document.getElementById('cadEmail').value.trim(),
            cpf:             document.getElementById('cadCpf').value.trim(),
            telefone:        document.getElementById('cadTelefone').value.trim(),
            senha:           document.getElementById('cadSenha').value,
            status_conta:    document.getElementById('cadStatus').value,
            id_funcao:       document.getElementById('cadPerfil').value,
            // type="date" já entrega YYYY-MM-DD — sem conversão necessária
            data_nascimento: inputDataNascCadastro?.value || null
        };

        try {
            const resp = await fetch('/api/admin/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            const resultado = await resp.json();
            if (!resp.ok) throw new Error(resultado.erro || 'Erro ao cadastrar.');
            fecharModal(modalCadastro);
            await carregarUsuarios();
        } catch (error) {
            mostrarAlerta(alertCadastro, error.message, 'error');
        }
    }

    // ===== Modal Editar =====
    async function abrirModalEdicao(id) {
        esconderAlerta(alertEditar);
        formEditar.reset();
        try {
            const resp = await fetch(`/api/admin/usuarios/${id}`);
            const user = await resp.json();

            document.getElementById('editId').value          = user.id_usuario;
            document.getElementById('editNome').value        = user.nome_completo;
            document.getElementById('editEmail').value       = user.email;
            document.getElementById('editCpf').value         = user.cpf || '';
            document.getElementById('editTelefone').value    = user.telefone || '';
            document.getElementById('editDataCadastro').value = formatarData(user.criado_em);
            document.getElementById('editStatus').value      = isAtivo(user.status_conta) ? 'Ativo' : 'Inativo';
            selectPerfilEditar.value = user.id_funcao || '';

            // type="date" espera YYYY-MM-DD — data_nascimento já vem nesse formato do banco
            if (inputDataNascEditar) {
                inputDataNascEditar.value = user.data_nascimento
                    ? user.data_nascimento.slice(0, 10)
                    : '';
            }

            abrirModal(modalEditar);
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar dados do usuário.');
        }
    }

    async function enviarEdicao(event) {
        event.preventDefault();
        esconderAlerta(alertEditar);

        const id = document.getElementById('editId').value;
        const dados = {
            nome_completo:   document.getElementById('editNome').value.trim(),
            email:           document.getElementById('editEmail').value.trim(),
            cpf:             document.getElementById('editCpf').value.trim(),
            telefone:        document.getElementById('editTelefone').value.trim(),
            status_conta:    document.getElementById('editStatus').value,
            id_funcao:       selectPerfilEditar.value,
            // type="date" já entrega YYYY-MM-DD — sem conversão necessária
            data_nascimento: inputDataNascEditar?.value || null
        };

        try {
            const resp = await fetch(`/api/admin/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            const resultado = await resp.json();
            if (!resp.ok) throw new Error(resultado.erro || 'Erro ao salvar.');
            fecharModal(modalEditar);
            await carregarUsuarios();
        } catch (error) {
            mostrarAlerta(alertEditar, error.message, 'error');
        }
    }

    // ===== Modal Excluir =====
    function abrirModalExclusao(id, nome) {
        esconderAlerta(alertExcluir);
        usuarioParaExcluir = id;
        if (nomeUsuarioExcluir) nomeUsuarioExcluir.textContent = nome;
        abrirModal(modalExcluir);
    }

    async function confirmarExclusao() {
        if (!usuarioParaExcluir) return;
        esconderAlerta(alertExcluir);
        try {
            const resp = await fetch(`/api/admin/usuarios/${usuarioParaExcluir}`, { method: 'DELETE' });
            const resultado = await resp.json();
            if (!resp.ok) throw new Error(resultado.erro || 'Erro ao excluir.');
            usuarioParaExcluir = null;
            fecharModal(modalExcluir);
            await carregarUsuarios();
        } catch (error) {
            mostrarAlerta(alertExcluir, error.message, 'error');
        }
    }

    // ===== Modal Detalhes =====
    async function abrirModalDetalhes(id) {
        try {
            const resp = await fetch(`/api/admin/usuarios/${id}`);
            const user = await resp.json();
            const ativo = isAtivo(user.status_conta);

            detalhesConteudo.innerHTML = `
                <div class="detalhe-item"><span>Nome Completo</span><span>${escapeHtml(user.nome_completo)}</span></div>
                <div class="detalhe-item"><span>Email</span><span>${escapeHtml(user.email)}</span></div>
                <div class="detalhe-item"><span>CPF</span><span>${escapeHtml(user.cpf || '-')}</span></div>
                <div class="detalhe-item"><span>Telefone</span><span>${escapeHtml(user.telefone || '-')}</span></div>
                <div class="detalhe-item"><span>Data de Nascimento</span><span>${formatarData(user.data_nascimento)}</span></div>
                <div class="detalhe-item"><span>Data de Cadastro</span><span>${formatarData(user.criado_em)}</span></div>
                <div class="detalhe-item"><span>Perfil</span><span>${capitalizar(user.perfil)}</span></div>
                <div class="detalhe-item"><span>Status</span><span>${ativo ? 'Ativo' : 'Inativo'}</span></div>
            `;
            abrirModal(modalDetalhes);
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar detalhes do usuário.');
        }
    }

    // ===== Máscaras =====
    function configurarMascaras() {
        ['cadCpf', 'editCpf'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => aplicarMascaraCPF(el));
        });
        ['cadTelefone', 'editTelefone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => aplicarMascaraTelefone(el));
        });
    }

    function aplicarMascaraCPF(input) {
        let v = input.value.replace(/\D/g, '').slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        input.value = v;
    }

    function aplicarMascaraTelefone(input) {
        let v = input.value.replace(/\D/g, '').slice(0, 11);
        v = v.replace(/^(\d{2})(\d)/, '($1) $2');
        v = v.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        input.value = v;
    }

    // ===== Utilitários de Modal =====
    function configurarFechamentoModais() {
        document.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', () => {
                fecharModal(document.getElementById(el.dataset.closeModal));
            });
        });

        [modalCadastro, modalEditar, modalExcluir, modalDetalhes].forEach(modal => {
            if (!modal) return;
            modal.addEventListener('click', (e) => {
                if (e.target === modal) fecharModal(modal);
            });
        });
    }

    function abrirModal(m)  { m?.classList.add('active'); }
    function fecharModal(m) { m?.classList.remove('active'); }

    function mostrarAlerta(el, msg, tipo) {
        if (!el) return;
        el.textContent = msg;
        el.className = `modal-alert show-${tipo === 'success' ? 'success' : 'error'}`;
    }

    function esconderAlerta(el) {
        if (!el) return;
        el.textContent = '';
        el.className = 'modal-alert';
    }

    // ===== Helpers =====
    function isAtivo(s)    { return !String(s || '').toLowerCase().startsWith('inativ'); }
    function capitalizar(t){ return t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : '-'; }
    function escapeHtml(t) { const d = document.createElement('div'); d.textContent = String(t ?? ''); return d.innerHTML; }

    function formatarData(iso) {
        if (!iso) return '-';
        const d = new Date(iso);
        return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('pt-BR');
    }

    function gerarSenhaAleatoria() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
        return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
}
