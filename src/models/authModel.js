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
        if (authError) throw authError;

        // Buscando o usuário e a função do usuário
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('id_usuario, email')
            .ilike('email', emailLimpo)
            .single();

        if (userError || !usuario) {
            throw new Error(`Usuário autenticado, mas o e-mail "${emailLimpo}" não foi encontrado na tabela public.usuarios.`);
        }

        // Consulta a função do usuário
        const { data: vinculoFuncao, error: roleError } = await supabase
            .from('funcao_usuario')
            .select(`funcao_id`)
            .eq('usuario_id', usuario.id_usuario)
            .maybeSingle();

        if (roleError || !vinculoFuncao) {
            throw new Error('Usuário autenticado, mas nenhuma função correspondente foi encontrada vinculada a ele.');
        }

        // Busca o nome da função
        const { data: funcaoData, error: funcaoError } = await supabase
            .from('funcoes')
            .select('nome')
            .eq('id_funcao', vinculoFuncao.funcao_id)
            .maybeSingle();

        if (funcaoError || !funcaoData) {
            throw new Error(`Função com id_funcao ${vinculoFuncao.funcao_id} não cadastrada.`);
        }

        const roleNome = funcaoData.nome.toLowerCase();

        // retorna os dados da sessão
        return {
            session: authData.session,
            user: authData.user,
            role: roleNome
        };
    },

    // Buscando o Nome de Usuário pelo email
    buscarNomeUsuario: async (email) => {
        const { data, error } = await supabase
            .from('usuarios')
            .select('nome_completo')
            .ilike('email', email)
            .maybeSingle();

        if (error) throw error;
        return data ? data.nome_completo : email;
    },

    // Cadastrando usuários como pacientes pelo formulário de cadastro público
    registro: async (nomeCompleto, cpf, email, senha, dataNascimento, idFuncaoPadrao = 3) => {
        const emailLimpo = email ? email.trim() : '';
        const senhaTexto = String(senha);

        // Cadastrando as credenciais no cofre do Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: emailLimpo,
            password: senhaTexto,
            options: {
                data: { display_name: nomeCompleto }
            }
        });

        if (authError) throw authError;

        // Inserindo os dados adicionais na sua tabela pública 'usuarios'
        const { data: novoUsuario, error: userError } = await supabase
            .from('usuarios')
            .insert([{
                nome_completo: nomeCompleto,
                cpf: cpf,
                email: emailLimpo,
                senha_hash: senhaTexto,
                data_nascimento: dataNascimento,
                status_conta: 'Ativa'
            }])
            .select('id_usuario')
            .single();

        if (userError) {
            // Se falhar a tabela pública, remove do Auth para evitar dados que não serão usados
            try { 
                await supabase.auth.admin.deleteUser(authData.user.id); 
            } catch (err) {
                console.error("Não foi possível limpar o usuário do Auth:", err.message);
            }
            throw userError;
        }

        // Vincula o novo usuário à função de paciente na tabela 'funcao_usuario'
        const { error: roleError } = await supabase
            .from('funcao_usuario')
            .insert([{
                usuario_id: novoUsuario.id_usuario,
                id_funcao: idFuncaoPadrao
            }]);

        if (roleError) throw roleError;

        return novoUsuario;
    }
};

module.exports = AuthModel;