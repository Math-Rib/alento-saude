const EspecialidadeModel = require('../models/especialidadeModel');

const especialidadeController = {
    // Processa a submissão do formulário de cadastro de especialidade
    handleCadastro: async (req, res) => {
        // Coleta as variáveis definidas pelo atributo 'name' de cada tag input do HTML
        const { titulo, descricao, tempoMedio, valor, status } = req.body;

        // Identifica o usuário logado
        const adminResponsavel = req.user.nome_completo;

        try {
            // Executa a persistência através do Model
            await EspecialidadeModel.criar(titulo, descricao, tempoMedio, valor, status, adminResponsavel);

            // Redireciona o Administrador de volta para a tela de listagem injetando um parâmetro de sucesso
            return res.redirect('/admin/gestao_especialidades?sucesso=true');

        } catch (error) {
            console.error("Erro capturado no EspecialidadeController:", error.message);
            // Retorna uma mensagem de erro tratada em caso de falha física ou de validação
            return res.status(400).send(`Erro ao realizar o cadastro da especialidade: ${error.message}`);
        }
    },

    listarAPI: async (req, res) => {
        try {
            const especialidades = await EspecialidadeModel.listar();
            return res.status(200).json(especialidades);
        } catch (error) {
            console.error("Erro ao listar especialidades:", error.message);
            return res.status(500).json({ error: 'Erro ao buscar especialidades no banco.' });
        }
    },

    handleEditar: async (req, res) => {
        // Coleta o ID e os novos dados do formulário
        const { id, titulo, descricao, tempoMedio, valor, status } = req.body;

        // Identifica o usuário logado
        const adminResponsavel = req.user.nome_completo;

        try {
            // Chama a função de atualização no Model
            await EspecialidadeModel.atualizar(id, titulo, descricao, tempoMedio, valor, status, adminResponsavel);

            // Redireciona com sucesso
            return res.redirect('/admin/gestao_especialidades?editado=true');
        } catch (error) {
            console.error("Erro na edição:", error.message);
            return res.status(400).send(`Erro ao editar: ${error.message}`);
        }
    },

    handleExcluir: async (req, res) => {
        const { id } = req.body;

        // Identifica o usuário logado
        const adminResponsavel = req.user.nome_completo;

        try {
            await EspecialidadeModel.deletar(id, adminResponsavel);
            return res.status(200).json({ mensagem: 'Excluído com sucesso' });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
};

module.exports = especialidadeController;