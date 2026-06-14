const supabase = require('../../config/supabase');

const AdminUsuarioModel = {

    // Lista usuários com filtros
    listar: async (filtros = {}) => {
        const { busca, perfil, status, periodo } = filtros;

        // CORREÇÃO: duas queries separadas em vez de join aninhado
        // Isso evita falha silenciosa quando a FK funcao_usuario→funcoes
        // não está declarada no painel do Supabase

        let query = supabase
            .from('usuarios')
            .select(`
                id_usuario,
                nome_completo,
                email,
                cpf,
                telefone,
                status_conta,
                criado_em,
                data_nascimento,
                funcao_usuario ( id_funcao )
            `)
            .order('criado_em', { ascending: false });

        if (busca) {
            query = query.or(`nome_completo.ilike.%${busca}%,email.ilike.%${busca}%,cpf.ilike.%${busca}%`);
        }

        if (status) {
            query = query.eq('status_conta', status);
        }

        if (periodo) {
            const agora = new Date();
            let dataInicio = null;
            switch (periodo) {
                case 'hoje':   dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()); break;
                case '7dias':  dataInicio = new Date(agora); dataInicio.setDate(dataInicio.getDate() - 7); break;
                case '30dias': dataInicio = new Date(agora); dataInicio.setDate(dataInicio.getDate() - 30); break;
                case 'mes':    dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1); break;
                case 'ano':    dataInicio = new Date(agora.getFullYear(), 0, 1); break;
            }
            if (dataInicio) query = query.gte('criado_em', dataInicio.toISOString());
        }

        const { data: usuarios, error } = await query;
        if (error) throw error;

        // Busca todas as funções de uma vez para montar o nome do perfil
        const { data: funcoes, error: funcaoError } = await supabase
            .from('funcoes')
            .select('id_funcao, nome');

        if (funcaoError) throw funcaoError;

        const mapaFuncoes = {};
        funcoes.forEach(f => { mapaFuncoes[f.id_funcao] = f.nome; });

        // Monta o resultado final
        let resultado = usuarios.map(usuario => {
            const vinculo   = usuario.funcao_usuario?.[0];
            const id_funcao = vinculo?.id_funcao || null;
            return {
                id_usuario:      usuario.id_usuario,
                nome_completo:   usuario.nome_completo,
                email:           usuario.email,
                cpf:             usuario.cpf,
                telefone:        usuario.telefone,
                status_conta:    usuario.status_conta,
                criado_em:       usuario.criado_em,
                data_nascimento: usuario.data_nascimento,
                id_funcao,
                perfil: id_funcao ? (mapaFuncoes[id_funcao] || 'Sem perfil') : 'Sem perfil'
            };
        });

        // Filtro por perfil feito em JS (mais seguro que o join aninhado)
        if (perfil) {
            resultado = resultado.filter(u => String(u.id_funcao) === String(perfil));
        }

        return resultado;
    },

    // Busca um único usuário pelo id
    buscarPorId: async (id) => {
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
                id_usuario,
                nome_completo,
                email,
                cpf,
                telefone,
                status_conta,
                criado_em,
                data_nascimento,
                funcao_usuario ( id_funcao )
            `)
            .eq('id_usuario', id)
            .single();

        if (error) throw error;

        const id_funcao = data.funcao_usuario?.[0]?.id_funcao || null;

        // Busca o nome do perfil separadamente
        let nomePerfil = 'Sem perfil';
        if (id_funcao) {
            const { data: funcao } = await supabase
                .from('funcoes')
                .select('nome')
                .eq('id_funcao', id_funcao)
                .single();
            if (funcao) nomePerfil = funcao.nome;
        }

        return {
            id_usuario:      data.id_usuario,
            nome_completo:   data.nome_completo,
            email:           data.email,
            cpf:             data.cpf,
            telefone:        data.telefone,
            status_conta:    data.status_conta,
            criado_em:       data.criado_em,
            data_nascimento: data.data_nascimento,
            id_funcao,
            perfil: nomePerfil
        };
    },

    // Lista os perfis (funções) para os <select>
    listarFuncoes: async () => {
        const { data, error } = await supabase
            .from('funcoes')
            .select('id_funcao, nome')
            .order('id_funcao', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Cria usuário: verifica email duplicado → Auth → usuarios → funcao_usuario
    criar: async (dados) => {
        const { nome_completo, email, cpf, telefone, senha, status_conta, id_funcao, data_nascimento } = dados;
        const emailLimpo = email.trim();
        const senhaTexto = String(senha);

        // 1. Verifica se o email já existe na tabela usuarios antes de ir pro Auth
        const { data: existente } = await supabase
            .from('usuarios')
            .select('id_usuario')
            .ilike('email', emailLimpo)
            .maybeSingle();

        if (existente) {
            throw new Error('Este e-mail já está cadastrado no sistema.');
        }

        // 2. Cria no Supabase Auth via signUp (compatível com anon key)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: emailLimpo,
            password: senhaTexto,
            options: { data: { display_name: nome_completo } }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Erro desconhecido ao criar usuário no Auth.');

        // 3. Insere na tabela 'usuarios'
        const { data: novoUsuario, error: userError } = await supabase
            .from('usuarios')
            .insert([{
                nome_completo,
                email: emailLimpo,
                cpf,
                telefone,
                senha_hash:      senhaTexto,
                status_conta:    status_conta || 'Ativo',
                data_nascimento: data_nascimento || null
            }])
            .select('id_usuario')
            .single();

        if (userError) throw userError;

        // 4. Vincula ao perfil escolhido
        const { error: roleError } = await supabase
            .from('funcao_usuario')
            .insert([{ id_usuario: novoUsuario.id_usuario, id_funcao }]);

        if (roleError) throw roleError;

        return { id_usuario: novoUsuario.id_usuario };
    },

    // Atualiza dados do usuário e perfil vinculado
    atualizar: async (id, dados) => {
        const { nome_completo, email, cpf, telefone, status_conta, id_funcao, data_nascimento } = dados;
        const emailNovo = email.trim();

        // 1. Atualiza tabela 'usuarios'
        const { error: userError } = await supabase
            .from('usuarios')
            .update({ nome_completo, email: emailNovo, cpf, telefone, status_conta, data_nascimento: data_nascimento || null })
            .eq('id_usuario', id);

        if (userError) throw userError;

        // 2. Atualiza perfil vinculado
        if (id_funcao) {
            const { error: roleError } = await supabase
                .from('funcao_usuario')
                .update({ id_funcao })
                .eq('id_usuario', id);

            if (roleError) throw roleError;
        }

        return { id_usuario: id };
    },

    // Remove vínculo de função + registro da tabela usuarios
    deletar: async (id) => {
        const { error: funcaoError } = await supabase
            .from('funcao_usuario')
            .delete()
            .eq('id_usuario', id);

        if (funcaoError) throw funcaoError;

        const { error: userError } = await supabase
            .from('usuarios')
            .delete()
            .eq('id_usuario', id);

        if (userError) throw userError;
    }

};

module.exports = AdminUsuarioModel;