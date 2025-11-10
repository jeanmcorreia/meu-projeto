var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
  res.render('suporte', {
    title: 'Suporte Técnico',
    data: {},
    errors: {}
  });
});

router.post('/',
  [
    body('nome')
      .trim().isLength({ min: 3, max: 60 }).withMessage('Nome deve ter entre 3 e 60 caracteres.')
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/).withMessage('Nome contém caracteres inválidos.')
      .escape(),
    body('email')
      .trim().isEmail().withMessage('E-mail inválido.')
      .normalizeEmail(),
    body('tipo')
      .isIn(['', 'instalacao', 'atualizacao', 'conexao', 'desempenho']).withMessage('Selecione um tipo válido.'),
    body('mensagem')
      .trim().isLength({ min: 10, max: 500 }).withMessage('Mensagem deve ter entre 10 e 500 caracteres.').escape()
  ],
  (req, res) => {
    const errors = validationResult(req);

    // Pare reprovar o formulário mantemos os dados originais (com algumas sanitizações)
    const data = {
      nome: req.body.nome,
      email: req.body.email,
      tipo: req.body.tipo || '',
      mensagem: req.body.mensagem
    };

    if (!errors.isEmpty()) {
      // Mapeia erros por campo para facilitar no EJS
      const mapped = errors.mapped(); // { camp: { msg, param, ... } }
      return res.status(400).render('suporte', {
        title: 'Solicitação de Suporte',
        data,
        errors: mapped
      });
    }

    return res.render('sucesso-suporte', {
      title: 'Solicitação Enviada',
      data
    });
});

module.exports = router;