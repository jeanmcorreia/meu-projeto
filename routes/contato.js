const express = require('express');
const router = express.Router();
const { validate } = require('../middlewares/validate');
const asyncHandler = require('../middlewares/asyncHandler');
const container = require('../container');
const ContatoController = require('../controllers/ContatoController');
const controller = new ContatoController(container.contatoService);


// Create
router.get('/', asyncHandler(controller.form.bind(controller)));
router.post('/', validate(controller.regrasCriar()), asyncHandler(controller.criar.bind(controller)));

// Read
router.get('/lista', asyncHandler(controller.lista.bind(controller)))

// Update
router.get('/:id/editar', asyncHandler(controller.editarForm.bind(controller)));
router.post('/:id/editar', validate(controller.regrasEditar()), asyncHandler(controller.editar.bind(controller)));

// Delete
router.post('/:id/delete', asyncHandler(controller.excluir.bind(controller)));

module.exports = router;