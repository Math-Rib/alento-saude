const express = require('express');
const router  = express.Router(); // ← mesmo fix

const pacienteController          = require('../controllers/pacienteController');
const { checkAuth, isPaciente }   = require('../middlewares/authMiddleware');

router.get   ('/api/paciente/perfil', checkAuth, isPaciente, pacienteController.getPerfil);
router.post  ('/api/paciente/perfil', checkAuth, isPaciente, pacienteController.criarPerfil);
router.put   ('/api/paciente/perfil', checkAuth, isPaciente, pacienteController.atualizarPerfil);
router.delete('/api/paciente/perfil', checkAuth, isPaciente, pacienteController.deletarPerfil);

module.exports = router;