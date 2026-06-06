// src/models/authModel.js
const supabase = require('../../config/supabase');

const AuthModel = {

    login: async (email, senha_hash) => {
        // Garante que o e-mail não vá com espaços vazios acidentais nas pontas
        const emailLimpo = email ? email.trim() : '';

        // Fazendo a autenticação no Supabase através do email e da senha
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: emailLimpo,
            password: senha_hash,
        });

        // Envia o erro para o Controller mostrar ao usuário
        if (authError) {
            throw authError;
        }

        // Buscando o usuário e a função do usuário
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('id_usuario, email')
            .ilike('email', emailLimpo)
            .single(); // Garante que venha apenas um usuário no objeto

        if (userError || !usuario) {
            throw new Error(`Usuário autenticado, mas o e-mail "${emailLimpo}" não foi encontrado na tabela public.usuarios.`);
        }

        // Consulta a função do usuário
        const { data: vinculoFuncao, error: roleError } = await supabase
            .from('funcao_usuario')
            .select(`
            id_funcao,
            funcoes (
            nome
            )
        `)
            .eq('id_usuario', usuario.id_usuario)
            .single(); // Garante que venha apenas uma função no objeto

        if (roleError || !vinculoFuncao || !vinculoFuncao.funcoes) {
            throw new Error('Usuário autenticado, mas nenhuma função correspondente foi encontrada vinculada a ele.');
        }

        const roleNome = vinculoFuncao.funcoes.nome.toLowerCase();

        // retorna os dados da sessão
        return {
            session: authData.session,
            user: authData.user,
            role: roleNome
        };
    }
};

module.exports = AuthModel;