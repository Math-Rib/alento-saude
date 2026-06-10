const express = require('express');
const router  = express.Router(); // ← usa o express já importado, não require() de novo

const medicoController        = require('../controllers/medicoController');
const { checkAuth, isMedico } = require('../middlewares/authMiddleware');

router.get ('/api/medico/perfil', checkAuth, isMedico, medicoController.getPerfil);
router.post('/api/medico/perfil', checkAuth, isMedico, medicoController.criarPerfil);
router.put ('/api/medico/perfil', checkAuth, isMedico, medicoController.atualizarPerfil);

module.exports = router;