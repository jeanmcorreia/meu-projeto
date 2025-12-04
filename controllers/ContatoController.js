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
        if (req.validationMapped) {
            return res.status(400).render('contato', {
                title: 'Formulário de Contato',
                data: this._payload(req.body),
                errors: req.validationMapped
            });
        }
        const contato = await this.service.criar(this._payload(req.body));
        
        return res.render('sucesso', {title: 'Enviado com sucesso', data: contato });
    }

    async lista(req, res) {
        const contatos = await this.service.listar();
        res.render('contatos-lista', { title: 'Lista de Contatos', contatos });
    }

    async editarForm(req, res) {
        const id = Number(req.params.id);
        const contato = await this.service.obter(id)
        if(!contato) return res.redirect('/contato/lista');
        res.render('contato-editar', { title: 'Editar Contato', data: contato, errors: {} });
    }

    async editar(req, res) {
        const id = Number(req.params.id);
        if(req.validationMapped) {
            const data = this._payload(req.body); data.id = id;
            return res.status(400).render('contato-editar', { title: 'Editar Contato', data, errors: req.validationMapped });
        }
        await this.service.atualizar(id, this._payload(req.body));
        return res.redirect('/contato/lista');
    }

    async excluir(req, res) {
        const id = Number(req.params.id);
        await this.service.excluir(id);
        res.redirect('/contato/lista');
    }

    _payload(body) {
        return {
            nome: body.nome,
            email: body.name,
            idade: body.idade || null,
            genero: body.genero || '',
            interesses: body.interesses || [],
            mensagem: body.mensagem,
            aceite: body.aceite === 'on'
        };
    }
}

module.exports = ContatoController;