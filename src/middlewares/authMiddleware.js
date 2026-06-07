const supabase = require('../../config/supabase');

// Middleware Base: Verifica se está logado e extrai os dados do usuário
const checkAuth = async (req, res, next) => {
    const token = req.cookies.alento_token;
    if (!token) return res.redirect('/login');

    try {
        // Valida o token no cofre do Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) throw authError;

        // Busca o usuário no banco
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('id_usuario, email')
            .ilike('email', user.email)
            .single();

        if (userError || !usuario) throw new Error('Usuário não encontrado no banco de dados.');

        // CORREÇÃO PASSO 1: Busca apenas o ID da função na tabela funcao_usuario
        const { data: vinculoFuncao, error: roleError } = await supabase
            .from('funcao_usuario')
            .select('id_funcao')
            .eq('id_usuario', usuario.id_usuario)
            .maybeSingle();

        if (roleError || !vinculoFuncao) throw new Error('Nenhuma função vinculada ao usuário no banco de dados.');

        // CORREÇÃO PASSO 2: Busca o nome da função diretamente na tabela funcoes
        const { data: funcaoData, error: funcaoError } = await supabase
            .from('funcoes')
            .select('nome')
            .eq('id_funcao', vinculoFuncao.id_funcao)
            .maybeSingle();

        if (funcaoError || !funcaoData) throw new Error('Função correspondente não cadastrada na tabela funcoes.');

        // CORREÇÃO PASSO 3: Remove os acentos e padroniza para minúsculo
        const roleNome = funcaoData.nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        req.user = {
            ...user,
            id_publico: usuario.id_usuario,
            role: roleNome
        }; // Guarda o usuário na requisição
        
        next();
    } catch (error) {
        console.error('Erro no Middleware checkAuth:', error.message);
        res.clearCookie('alento_token');
        return res.redirect('/login');
    }
};

// Middleware para validar se é PACIENTE
const isPaciente = (req, res, next) => {
  if (req.user && req.user.role === 'paciente') return next();
  return res.status(403).send('Acesso negado: Apenas para Pacientes.');
};

// Middleware para validar se é MÉDICO
const isMedico = (req, res, next) => {
  if (req.user && req.user.role === 'medico') return next();
  return res.status(403).send('Acesso negado: Apenas para Médicos.');
};

// Middleware para validar se é ADMINISTRADOR
const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'administrador')) return next();
  return res.status(403).send('Acesso negado: Área restrita ao Administrador.');
};

module.exports = { checkAuth, isPaciente, isMedico, isAdmin };