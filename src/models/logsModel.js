const supabase = require('../../config/supabase');

const LogsModel = {

    registrar: async (responsavel, acao, tabela, descricao, id_afetado) => {
        try {
            const agora = new Date();

            // Formatando a data atual para salvar no supabase
            const dataAtual = agora.toISOString().split('T')[0];

            // Formatando a hora atual para salvar no supabase
            const horaAtual = agora.toTimeString().split(' ')[0];

            const { error } = await supabase
                .from('logs_sistema')
                .insert([{
                    usuario_responsavel: responsavel,
                    acao: acao,
                    tabela_afetada: tabela,
                    descricao: descricao,
                    id_afetado: id_afetado,
                    hora: horaAtual,
                    data: dataAtual
                }]);

            if (error) throw error;
        } catch (error) {
            console.error('Erro crítico ao gravar log:', error.message);
        }
    },

    listar: async () => {
        const { data, error } = await supabase
            .from('logs_sistema')
            .select('*')
            .order('id_log', { ascending: false });

        if (error) throw error;
        return data;
    }
};

module.exports = LogsModel;