const supabase = require('../../config/supabase');
const LogsModel = require('./logsModel');

const EspecialidadeModel = {

    criar: async (nome, descricao, tempoMedio, valor, statusInicial, adminResponsavel) => {
        // Garante que o tempo seja gravado como um número Inteiro
        const tempo = parseInt(tempoMedio, 10);

        // Transforma "80,00" em 80.00 (Float decimal) para o banco aceitar
        let valorLimpo = String(valor).replace(/[^\d,.-]/g, '').replace(',', '.');
        const valorFloat = parseFloat(valorLimpo);

        // Insere no Supabase usando os nomes exatos das colunas do seu banco
        const { data, error } = await supabase
            .from('especialidades')
            .insert([
                {
                    nome: nome,
                    descricao: descricao,
                    tempoMedio: tempo,
                    valorConsulta: valorFloat,
                    status: statusInicial
                }
            ])
            .select('id_especialidade')
            .single();

        if (error) {
            throw error;
        }

        // Registro de Cadastro de Especialidade no Logs de Sistema
        await LogsModel.registrar(adminResponsavel, 'INSERT', 'especialidades', `Cadastrou a especialidade: ${nome}`, data.id_especialidade);

        return data;
    },

    listar: async () => {
        const { data, error } = await supabase
            .from('especialidades')
            .select('*')
            .order('id_especialidade', { ascending: true });

        if (error) {
            throw error;
        }
        return data;
    },

    atualizar: async (id, nome, descricao, tempoMedio, valor, status, adminResponsavel) => {
        // Tratamento dos dados para o banco
        const tempo = parseInt(tempoMedio, 10);
        let valorLimpo = String(valor).replace(/[^\d,.-]/g, '').replace(',', '.');
        const valorFloat = parseFloat(valorLimpo);

        // Update no Supabase
        const { data, error } = await supabase
            .from('especialidades')
            .update({
                nome: nome,
                descricao: descricao,
                tempoMedio: tempo,
                valorConsulta: valorFloat,
                status: status
            })
            .eq('id_especialidade', id);

        if (error) throw error;

        // Registro de Atualização de Especialidade no Logs de Sistema
        await LogsModel.registrar(adminResponsavel, 'UPDATE', 'especialidades', 'Atualizou os dados da especialidade', id);

        return data;
    },

    deletar: async (id, adminResponsavel) => {
        const { error } = await supabase
            .from('especialidades')
            .delete()
            .eq('id_especialidade', id);
        if (error) throw error;

        // Registro de Exclusão de Especialidade no Logs de Sistema
        await LogsModel.registrar(adminResponsavel, 'DELETE', 'especialidades', 'Excluiu os dados da especialidade', id);
    }
};

module.exports = EspecialidadeModel;