const { body } = require('express-validator');

const regras = [
    body('nome').trim().isLength({ min: 3, max: 60}).withMessage('Nome deve ter entre 3 e 60.')
    .matches(/^[A-Za-zÁ-ÖØ-öø-ÿ' -]+$/).withMessage('Nome inválido.').escape(),

    body('email').trim().isEmail().withMessage('E-mail inválido.').normalizeEmail(),

    body('idade').trim().optional({ checkFalsy: true }).isInt({ min:1, max:120 }).withMessage('Idade 1..120').toInt(),

    body('genero').isIn(['', 'feminino', 'masculino', 'nao-binario', 'prefiro-nao-informar']).withMessage('Gênero inválido'),
    
    body('interesses').optional({ checkFalsy: true }).customSanitizer(v => Array.isArray(v) ? v : (v ? [v] : [])).custom(arr => {
        const valid = ['node', 'express', 'ejs', 'frontend', 'backend'];
        return arr.every(x => valid.includes(x));
    }).withMessage('Interesse inválido.'),

    body('mensagem').trim().isLength({ min:10, max:500 }).withMessage('Mensagem 10..500').escape(),

    body('aceite').equals('on').withMessage('Aceite os termos.')
];

class ContatoController {
    constructor(service) { this.service = service; }

    regrasCriar() { return regras; }
    regrasEditar() { return regras; }

    async form(req, res) {
        res.render('contato', { title: 'Formulário de Contato', data: {}, errors: {} });
    }

    async criar(req, res) {
        pass
    }
}