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

router.post('/', (req, res) => {
  console.log(req.body);
  res.send('Requisição POST recebida');
})

module.exports = router;