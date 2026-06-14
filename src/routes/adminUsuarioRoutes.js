const express = require('express');
const router = express.Router();

const adminUsuarioController = require('../controllers/adminUsuarioController');
const { checkAuth, isAdmin } = require('../middlewares/authMiddleware');

// Todas as rotas abaixo exigem usuário autenticado com perfil Administrador
router.use(checkAuth, isAdmin);

// Lista de perfis (funções) disponíveis - usado para popular os <select> do front
router.get('/api/admin/funcoes', adminUsuarioController.listarFuncoes);

// CRUD de usuários da tela "Gestão de Usuários"
router.get('/api/admin/usuarios', adminUsuarioController.listar);
router.get('/api/admin/usuarios/:id', adminUsuarioController.buscarPorId);
router.post('/api/admin/usuarios', adminUsuarioController.criar);
router.put('/api/admin/usuarios/:id', adminUsuarioController.atualizar);
router.delete('/api/admin/usuarios/:id', adminUsuarioController.deletar);

module.exports = router;
