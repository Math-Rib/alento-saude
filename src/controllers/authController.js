// src/controllers/authController.js
const AuthModel = require('../models/authModel');

const authController = {
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

  handleLogout: (req, res) => {
    res.clearCookie('alento_token');
    res.redirect('/login');
  }
};

module.exports = authController;