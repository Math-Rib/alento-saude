const PacienteModel = require('../models/pacienteModel');

const pacienteController = {

    // ── READ ──────────────────────────────────────────────
    // GET /api/paciente/perfil
    // Retorna os dados do usuário + perfil médico juntos
    getPerfil: async (req, res) => {
        try {
            const idUsuario = req.user.id_publico; // vem do authMiddleware (checkAuth)

            // Busca os dois em paralelo para economizar tempo
            const [usuario, perfil] = await Promise.all([
                PacienteModel.buscarUsuario(idUsuario),
                PacienteModel.buscarPerfil(idUsuario)
            ]);

            return res.status(200).json({
                sucesso: true,
                dados: { usuario, perfil } // perfil pode ser null se não foi criado ainda
            });

        } catch (error) {
            console.error('Erro em getPerfil (paciente):', error.message);
            return res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    // ── CREATE ────────────────────────────────────────────
    // POST /api/paciente/perfil
    // Usado quando o paciente preenche o perfil pela primeira vez
    criarPerfil: async (req, res) => {
        try {
            const idUsuario = req.user.id_publico;
            const { tipo_sanguineo, s, observacoes_medicas } = req.body;

            // Evita criar duplicata
            const perfilExistente = await PacienteModel.buscarPerfil(idUsuario);
            if (perfilExistente) {
                return res.status(409).json({
                    sucesso: false,
                    mensagem: 'Perfil já existe. Use PUT /api/paciente/perfil para atualizar.'
                });
            }

            const novoPerfil = await PacienteModel.criarPerfil(idUsuario, {
                tipo_sanguineo,
                s,
                observacoes_medicas
            });

            return res.status(201).json({ sucesso: true, dados: novoPerfil });

        } catch (error) {
            console.error('Erro em criarPerfil (paciente):', error.message);
            return res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    // ── UPDATE ────────────────────────────────────────────
    // PUT /api/paciente/perfil
    // Atualiza o perfil existente
    atualizarPerfil: async (req, res) => {
        try {
            const idUsuario = req.user.id_publico;
            const { tipo_sanguineo, s, observacoes_medicas } = req.body;

            const perfilAtualizado = await PacienteModel.atualizarPerfil(idUsuario, {
                tipo_sanguineo,
                s,
                observacoes_medicas
            });

            return res.status(200).json({ sucesso: true, dados: perfilAtualizado });

        } catch (error) {
            console.error('Erro em atualizarPerfil (paciente):', error.message);
            return res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    },

    // ── DELETE ────────────────────────────────────────────
    // DELETE /api/paciente/perfil
    // Remove o perfil médico do paciente (não deleta o usuário)
    deletarPerfil: async (req, res) => {
        try {
            const idUsuario = req.user.id_publico;

            await PacienteModel.deletarPerfil(idUsuario);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Perfil removido com sucesso.'
            });

        } catch (error) {
            console.error('Erro em deletarPerfil (paciente):', error.message);
            return res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

};

module.exports = pacienteController;