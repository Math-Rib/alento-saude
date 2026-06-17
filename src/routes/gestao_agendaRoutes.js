const express = require('express');
const router = express.Router();

const agendaController = require('../controllers/gestao_agenda');

router.get('/', agendaController.listarAgenda);

router.post('/', agendaController.criarAgenda);

router.put('/:id', agendaController.atualizarAgenda);

router.delete('/:id', agendaController.excluirAgenda);

module.exports = router;