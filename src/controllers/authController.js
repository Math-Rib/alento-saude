const AuthModel = require('../models/authModel');
const supabase = require('../../config/supabase');

const authController = {
  // Processando o formulário de login
  handleLogin: async (req, res) => {
    const { email, senha_hash } = req.body;

    try {
      // Faz login usando o Model que se conecta ao Supabase
      const sessionData = await AuthModel.login(email, senha_hash);
      const token = sessionData.session.access_token;
      const userRole = sessionData.role;

      // Salva o token em um cookie seguro HttpOnly
      res.cookie('alento_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 dia de duração
        sameSite: 'strict'
      });

      // Redireciona para a página principal da função de usuário no Supabase
      if (userRole === 'admin' || userRole === 'administrador') {
        return res.redirect('/admin/home');
      }
      if (userRole === 'medico') {
        return res.redirect('/medico/home');
      }
      if (userRole === 'paciente') {
        return res.redirect('/paciente/home');
      }

      // Se não tiver função definida
      res.clearCookie('alento_token');
      return res.status(403).send('Perfil não identificado.');

    } catch (error) {
      return res.status(401).send(`Erro na autenticação: ${error.message}`);
    }
  },

  // Processando o formulário de cadastro
  handleCadastro: async (req, res) => {
    // guarda os dados dos inputs do seu cadastro.html
    const { nome_completo, cpf, email, senha, data_nascimento } = req.body;

    try {
      // CONVERSÃO DE DATA: Transforma "DD/MM/AAAA" em "AAAA-MM-DD"
      let dataFormatada = null;

      if (data_nascimento && data_nascimento.includes('/')) {

        const [dia, mes, ano] = data_nascimento.split('/');
        dataFormatada = `${ano}-${mes}-${dia}`;

      } else {

        dataFormatada = data_nascimento;

      }
      // Cadastrando usário no banco de dados
      await AuthModel.registro(nome_completo, cpf, email, senha, dataFormatada, 3);

      // Caso o cadastro for concluído com sucesso, ele redireciona para o login
      return res.redirect('/login?sucesso=true');

    } catch (error) {
      console.error("Erro capturado no Controller:", error.message);
      return res.status(400).send(`Erro ao realizar o cadastro: ${error.message}`);
    }
  },

  handleLogout: async (req, res) => {
    try {
      // Encerra a sessão ativa no servidor do Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao encerrar sessão no Supabase:', error.message);
    } finally {
      // Garante que o cookie local seja limpo e o usuário seja expulso mesmo se o banco falhar
      res.clearCookie('alento_token');
      return res.redirect('/');
    }
  }
};

module.exports = authController;