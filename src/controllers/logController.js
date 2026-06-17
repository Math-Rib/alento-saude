const LogsModel = require('../models/logsModel');

const logsController = {
    listarAPI: async (req, res) => {
        try {
            const logs = await LogsModel.listar();
            return res.status(200).json(logs);
        } catch (error) {
            console.error("Erro ao buscar logs:", error.message);
            return res.status(500).json({ erro: 'Erro ao carregar logs.' });
        }
    }
};

module.exports = logsController;