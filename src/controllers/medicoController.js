const MedicoModel = require('../models/medicoModel');

const medicoController = {

    // ── READ ──────────────────────────────────────────────
    // GET /api/medico/perfil
    // Retorna os dados do usuário + perfil profissional juntos
    getPerfil: async (req, res) => {
        try {
            const idUsuario = req.user.id_publico; // vem do authMiddleware (checkAuth)

            // Busca os dois em paralelo para economizar tempo
            const [usuario, perfil] = await Promise.all([
                MedicoModel.buscarUsuario(idUsuario),
                MedicoModel.buscarPerfil(idUsuario)
            ]);

            return res.status(200).json({
                sucesso: true,
                dados: { usuario, perfil } // perfil pode ser null se não foi criado ainda
            });

        } catch (error) {
            console.error('Erro em getPerfil (medico):', error.message);
            return res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    // ── CREATE ────────────────────────────────────────────
    // POST /api/medico/perfil
    // Usado quando o médico preenche o perfil profissional pela primeira vez
    criarPerfil: async (req, res) => {
        try {
            const idUsuario = req.user.id_publico;
            const { CRM, uf_crm, biografia } = req.body;

            if (!CRM || !uf_crm) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM e UF do CRM são obrigatórios.'
                });
            }

            // Evita criar duplicata
            const perfilExistente = await MedicoModel.buscarPerfil(idUsuario);
            if (perfilExistente) {
                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'Perfil já existe. Use PUT /api/medico/perfil para atualizar.'
                });
            }

            const novoPerfil = await MedicoModel.criarPerfil(idUsuario, { CRM, uf_crm, biografia });

            return res.status(201).json({ sucesso: true, dados: novoPerfil });

        } catch (error) {
            console.error('Erro em criarPerfil (medico):', error.message);
            return res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    // ── UPDATE ────────────────────────────────────────────
    // PUT /api/medico/perfil
    // Atualiza o perfil profissional existente
    atualizarPerfil: async (req, res) => {
        try {
            const idUsuario = req.user.id_publico;
            const { CRM, uf_crm, biografia } = req.body;

            if (!CRM || !uf_crm) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'CRM e UF do CRM são obrigatórios.'
                });
            }

            const perfilAtualizado = await MedicoModel.atualizarPerfil(idUsuario, {
                CRM,
                uf_crm,
                biografia
            });

            return res.status(200).json({ sucesso: true, dados: perfilAtualizado });

        } catch (error) {
            console.error('Erro em atualizarPerfil (medico):', error.message);
            return res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

};

module.exports = medicoController;