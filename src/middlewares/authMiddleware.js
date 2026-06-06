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

        // Busca a função do usuário no banco
        const { data: vinculoFuncao, error: roleError } = await supabase
            .from('funcao_usuario')
            .select(`
            funcoes (
            nome
            )
        `)
            .eq('id_usuario', usuario.id_usuario)
            .single();

        if (roleError || !vinculoFuncao || !vinculoFuncao.funcoes) throw new Error('Nenhuma função vinculada ao usuário no banco de dados.');

        const roleNome = vinculoFuncao.funcoes.nome.toLowerCase();

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
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).send('Acesso negado: Área restrita ao Administrador.');
};

module.exports = { checkAuth, isPaciente, isMedico, isAdmin };