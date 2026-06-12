const express = require('express');
const router = express.Router();
const path = require('path');

// Importar o Controller de Autenticação e os Middlewares de proteção
const authController = require('../controllers/authController');
const especialidadeController = require('../controllers/especialidadeController');
const { checkAuth, isPaciente, isMedico, isAdmin } = require('../middlewares/authMiddleware');

// Rotas Públicas

/* Configura a rota principal ao acessar o localhost */
router.get('/', (req, res) => {
    /* Envia para o servidor o arquivo index.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'public', 'index.html'));
});

/* Configura a rota de contato ao acessar o localhost */
router.get('/contato', (req, res) => {
    /* Envia para o servidor o arquivo contato.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'public', 'contato.html'));
});

/* Configura a rota de login ao acessar o localhost */
router.get('/login', (req, res) => {
    /* Envia para o servidor o arquivo login.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'public', 'login.html'));
});

/* Configura a rota de cadastro ao acessar o localhost */
router.get('/cadastro', (req, res) => {
    /* Envia para o servidor o arquivo cadastro.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'public', 'cadastro.html'));
});

// Ações de formulário (POST) gerenciadas pelo Controller
router.post('/login', authController.handleLogin);
router.post('/cadastro', authController.handleCadastro);

// Ações de formulário (GET) gerenciadas pelo Controller
router.get('/logout', authController.handleLogout);

// Rotas Privadas do Paciente

/* Configura a rota da página principal do paciente ao acessar o localhost */
router.get('/paciente/home', checkAuth, isPaciente, (req, res) => {
    /* Envia para o servidor o arquivo home_paciente.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'paciente', 'home_paciente.html'));
});

/* Configura a rota da página agendamento do paciente ao acessar o localhost */
router.get('/paciente/agendamento', checkAuth, isPaciente, (req, res) => {
    /* Envia para o servidor o arquivo agendamento.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'paciente', 'agendamento.html'));
});

/* Configura a rota da página histórico do paciente ao acessar o localhost */
router.get('/paciente/historico', checkAuth, isPaciente, (req, res) => {
    /* Envia para o servidor o arquivo historico_paciente.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'paciente', 'historico_paciente.html'));
});

// Rotas Privadas do Médico

/* Configura a rota da página principal do médico ao acessar o localhost */
router.get('/medico/home', checkAuth, isMedico, (req, res) => {
    /* Envia para o servidor o arquivo home_medico.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'medico', 'home_medico.html'));
});

/* Configura a rota da página gestão de agenda do médico ao acessar o localhost */
router.get('/medico/gestao_de_agenda', checkAuth, isMedico, (req, res) => {
    /* Envia para o servidor o arquivo gestao_agenda.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'medico', 'gestao_agenda.html'));
});

/* Configura a rota da página atendimento do médico ao acessar o localhost */
router.get('/medico/atendimento', checkAuth, isMedico, (req, res) => {
    /* Envia para o servidor o arquivo atendimento.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'medico', 'atendimento.html'));
});

// Rotas Privadas do Administrador

/* Configura a rota da página principal do admin ao acessar o localhost */
router.get('/admin/home', checkAuth, isAdmin, (req, res) => {
    /* Envia para o servidor o arquivo home_admin.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'admin', 'home_admin.html')); 
});

/* Configura a rota da página gestão de usuário do admin ao acessar o localhost */
router.get('/admin/gestao_usuarios', checkAuth, isAdmin, (req, res) => {
    /* Envia para o servidor o arquivo gestao_de_usuarios.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'admin', 'gestao_usuario.html')); 
});

/* Configura a rota da página gestão de especialidades do admin ao acessar o localhost */
router.get('/admin/gestao_especialidades', checkAuth, isAdmin, (req, res) => {
    /* Envia para o servidor o arquivo gestao_especialidades.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'admin', 'gestao_especialidades.html')); 
});

/* Configura a rota da página logs de sistema do admin ao acessar o localhost */
router.get('/admin/logs_sistema', checkAuth, isAdmin, (req, res) => {
    /* Envia para o servidor o arquivo logs_sistema.html */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'admin', 'logs_sistema.html')); 
});

/* Configura a rota da página backup do banco do admin ao acessar o localhost */
router.get('/admin/backup_banco', checkAuth, isAdmin, (req, res) => {
    /* Envia para o servidor o arquivo backup_banco.html  */
    res.sendFile(path.join(__dirname, '..', 'views', 'private', 'admin', 'backup_banco.html')); 
});

/* Rotas das APIs */

// POST
/* Rota de cadastro de Especialidades */
router.post('/cadastroEspecialidades', checkAuth, isAdmin, especialidadeController.handleCadastro);

// GET
router.get('/api/teste', (req, res) => {
    res.json({ ok: true, mensagem: 'backend funcionando' });
});

router.get('/api/medico/perfil-teste', (req, res) => {
    res.json({ ok: true, user: req.user });
})

/* Rota de Busca de Especialidades */
router.get('/api/especialidades', checkAuth, especialidadeController.listarAPI);

// PUT
/* Rota de edição de Especialidades */
router.post('/editarEspecialidade', checkAuth, isAdmin, especialidadeController.handleEditar);

// DELETE
router.post('/excluirEspecialidade', checkAuth, isAdmin, especialidadeController.handleExcluir);

module.exports = router;