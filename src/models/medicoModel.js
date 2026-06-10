const supabase = require('../../config/supabase');

const MedicoModel = {

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

    // Busca o perfil profissional do médico na tabela 'perfil_medico'
    // Usa maybeSingle() pois o perfil pode não ter sido criado ainda
    buscarPerfil: async (idUsuario) => {
        const { data, error } = await supabase
            .from('perfil_medico')
            .select('*')
            .eq('id_usuário', idUsuario)
            .maybeSingle();

        if (error) throw error;
        return data; // retorna null se não existir, sem lançar erro
    },

    // Cria o perfil do médico (só deve ser chamado se ainda não existir)
    criarPerfil: async (idUsuario, { CRM, uf_crm, biografia }) => {
        const { data, error } = await supabase
            .from('perfil_medico')
            .insert([{
                'id_usuário': idUsuario,
                CRM:          CRM,
                uf_crm:       uf_crm,
                biografia:    biografia || null
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Atualiza o perfil do médico existente
    atualizarPerfil: async (idUsuario, { CRM, uf_crm, biografia }) => {
        const { data, error } = await supabase
            .from('perfil_medico')
            .update({ CRM, uf_crm, biografia })
            .eq('id_usuário', idUsuario)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Nota: médico não tem DELETE de perfil no home (só admin faz isso)
};

module.exports = MedicoModel;