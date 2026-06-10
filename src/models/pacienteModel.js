const supabase = require('../../config/supabase');

const PacienteModel = {

    // Busca os dados do usuário na tabela 'usuarios'
    buscarUsuario: async (idUsuario) => {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id_usuario, nome_completo, email, cpf, data_nascimento, status_conta')
            .eq('id_usuario', idUsuario)
            .single();

        if (error) throw error;
        return data;
    },

    // Busca o perfil médico do paciente na tabela 'perfil_paciente'
    // Usa maybeSingle() pois o perfil pode não ter sido criado ainda
    buscarPerfil: async (idUsuario) => {
        const { data, error } = await supabase
            .from('perfil_paciente')
            .select('*')
            .eq('id_usuário', idUsuario)
            .maybeSingle();

        if (error) throw error;
        return data; // retorna null se não existir, sem lançar erro
    },

    // Cria o perfil do paciente (só deve ser chamado se ainda não existir)
    criarPerfil: async (idUsuario, { tipo_sanguineo, s, observacoes_medicas }) => {
        const { data, error } = await supabase
            .from('perfil_paciente')
            .insert([{
                'id_usuário':      idUsuario,
                'tipo_sanguíneo':  tipo_sanguineo    || null,
                s:                 s                 || null,
                observacoes_medicas: observacoes_medicas || null
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Atualiza o perfil do paciente existente
    atualizarPerfil: async (idUsuario, { tipo_sanguineo, s, observacoes_medicas }) => {
        const { data, error } = await supabase
            .from('perfil_paciente')
            .update({
                'tipo_sanguíneo':    tipo_sanguineo,
                s:                   s,
                observacoes_medicas: observacoes_medicas
            })
            .eq('id_usuário', idUsuario)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Remove o perfil do paciente
    deletarPerfil: async (idUsuario) => {
        const { error } = await supabase
            .from('perfil_paciente')
            .delete()
            .eq('id_usuário', idUsuario);

        if (error) throw error;
        return true;
    }

};

module.exports = PacienteModel;