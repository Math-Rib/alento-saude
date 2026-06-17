// home_medico.js
// Busca o perfil do médico logado e preenche os dados dinâmicos da página

// ── Saudação baseada no horário ──────────────────────────────────────────────
function obterSaudacao() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
}

// ── Data por extenso em português ────────────────────────────────────────────
function obterDataFormatada() {
    const agora = new Date();
    const opcoes = {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
        year:    'numeric'
    };
    const texto = agora.toLocaleDateString('pt-BR', opcoes);
    // Capitaliza primeira letra (ex: "segunda-feira, 17 de junho de 2026")
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ── Busca na API e preenche o DOM ────────────────────────────────────────────
async function carregarPerfilMedico() {
    try {
        const res = await fetch('/api/medico/perfil');

        // Se o servidor retornar 401/403, redireciona pro login
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/login';
            return;
        }

        if (!res.ok) {
            console.error('[home_medico] Erro ao buscar perfil:', res.status);
            return;
        }

        const json = await res.json();

        if (!json.sucesso) {
            console.error('[home_medico] API retornou erro:', json.mensagem);
            return;
        }

        const { usuario } = json.dados;
        const nomeCompleto = usuario?.nome_completo || 'Médico';

        // ── Preenche o dropdown da navbar ────────────────────────────────────
        const elDropdown = document.getElementById('nome-dropdown');
        if (elDropdown) {
            elDropdown.textContent = `Olá, Dr(a). ${nomeCompleto}!`;
        }

        // ── Preenche a saudação dinâmica (Bom dia / Boa tarde / Boa noite) ──
        const elSaudacao = document.getElementById('saudacao');
        if (elSaudacao) {
            elSaudacao.textContent = obterSaudacao();
        }

        // ── Preenche o nome na seção de boas-vindas ──────────────────────────
        const elNome = document.getElementById('nome-boas-vindas');
        if (elNome) {
            elNome.textContent = nomeCompleto;
        }

        // ── Preenche a data por extenso ──────────────────────────────────────
        const elData = document.getElementById('data-hoje');
        if (elData) {
            elData.textContent = obterDataFormatada();
        }

        // ── Atualiza o título da aba do navegador ─────────────────────────────
        const primeiroNome = nomeCompleto.split(' ')[0];
        document.title = `Alento Saúde | Dr(a). ${primeiroNome}`;

    } catch (error) {
        console.error('[home_medico] Erro inesperado ao carregar perfil:', error);
    }
}

// Executa assim que o HTML estiver pronto
document.addEventListener('DOMContentLoaded', carregarPerfilMedico);
