const AdminUsuarioModel = require('../models/adminUsuarioModel');

const adminUsuarioController = {

    listar: async (req, res) => {
        try {
            const { busca, perfil, status, periodo } = req.query;
            const usuarios = await AdminUsuarioModel.listar({ busca, perfil, status, periodo });
            return res.json(usuarios);
        } catch (error) {
            console.error('Erro ao listar usuários:', error.message);
            return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
        }
    },

    buscarPorId: async (req, res) => {
        try {
            const usuario = await AdminUsuarioModel.buscarPorId(req.params.id);
            return res.json(usuario);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error.message);
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
    },

    listarFuncoes: async (req, res) => {
        try {
            const funcoes = await AdminUsuarioModel.listarFuncoes();
            return res.json(funcoes);
        } catch (error) {
            console.error('Erro ao listar perfis:', error.message);
            return res.status(500).json({ erro: 'Erro ao buscar perfis.' });
        }
    },

    criar: async (req, res) => {
        const { nome_completo, email, cpf, telefone, senha, status_conta, id_funcao, data_nascimento } = req.body;
        // Identifica o usuário logado
        const adminResponsavel = req.user.nome_completo;

        if (!nome_completo || !email || !cpf || !telefone || !senha || !id_funcao) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        // Valida e normaliza a data_nascimento (input type="date" já entrega YYYY-MM-DD)
        const dataNascimentoFinal = data_nascimento && data_nascimento.trim() !== ''
            ? data_nascimento.trim()
            : null;

        try {
            const novoUsuario = await AdminUsuarioModel.criar({
                nome_completo, email, cpf, telefone, senha,
                status_conta, id_funcao,
                data_nascimento: dataNascimentoFinal
            }, adminResponsavel);
            return res.status(201).json(novoUsuario);
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error.message);
            return res.status(400).json({ erro: `Erro ao cadastrar usuário: ${error.message}` });
        }
    },

    atualizar: async (req, res) => {
        const { id } = req.params;
        const { nome_completo, email, cpf, telefone, status_conta, id_funcao, data_nascimento } = req.body;
        // Identifica o usuário logado
        const adminResponsavel = req.user.nome_completo;

        if (!nome_completo || !email || !cpf || !telefone) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        // Valida e normaliza a data_nascimento
        const dataNascimentoFinal = data_nascimento && data_nascimento.trim() !== ''
            ? data_nascimento.trim()
            : null;

        try {
            const usuarioAtualizado = await AdminUsuarioModel.atualizar(id, {
                nome_completo, email, cpf, telefone,
                status_conta, id_funcao,
                data_nascimento: dataNascimentoFinal
            }, adminResponsavel);
            return res.json(usuarioAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error.message);
            return res.status(400).json({ erro: `Erro ao atualizar usuário: ${error.message}` });
        }
    },

    deletar: async (req, res) => {
        const { id } = req.params;
        // Identifica o usuário logado
        const adminResponsavel = req.user.nome_completo;
        try {
            await AdminUsuarioModel.deletar(id, adminResponsavel);
            return res.json({ sucesso: true });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error.message);
            return res.status(400).json({ erro: `Erro ao excluir usuário: ${error.message}` });
        }
    }
};

module.exports = adminUsuarioController;
