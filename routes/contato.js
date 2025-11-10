var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db');
const contatoValidators = [
    body('nome')
      .trim().isLength({ min: 3, max: 60 }).withMessage('Nome deve ter entre 3 e 60 caracteres.')
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/).withMessage('Nome contém caracteres inválidos.')
      .escape(),
    body('email')
      .trim().isEmail().withMessage('E-mail inválido.')
      .normalizeEmail(),
    body('idade')
      .trim().optional({ checkFalsy: true })
      .isInt({ min: 1, max: 120 }).withMessage('Idade deve ser um inteiro entre 1 e 120.')
      .toInt(),
    body('genero')
      .isIn(['', 'feminino', 'masculino', 'nao-binario', 'prefiro-nao-informar'])
      .withMessage('Gênero inválido.'),
    body('interesses')
      .optional({ checkFalsy: true })
      .customSanitizer(v => Array.isArray(v) ? v : (v ? [v] : [])) // sempre array
      .custom((arr) => {
        const valid = ['node', 'express', 'ejs', 'frontend', 'backend'];
        return arr.every(x => valid.includes(x));
      }).withMessage('Interesse inválido.'),
    body('mensagem')
      .trim().isLength({ min: 10, max: 500 }).withMessage('Mensagem deve ter entre 10 e 500 caracteres.')
      .escape(),
    body('aceite')
      .equals('on').withMessage('Você deve aceitar os termos para continuar.')
  ]

/**
 * GET /contato – exibe o formulário.
 * Enviamos 'data' vazio e 'errors' vazio para facilitar o template.
 */
router.get('/', (req, res) => {
  res.render('contato', {
    title: 'Formulário de Contato',
    method: 'post',
    action: '/contato',
    data: {},
    errors: {}
  });
});

/**
 * POST /contato – valida, sanitiza e decide: erro -> reexibir formulário; sucesso -> página de sucesso
 */
router.post('/', contatoValidators, (req, res) => {
    const errors = validationResult(req);

    // Para repovoar o formulário, mantemos os dados originais (com algumas sanitizações acima)
    const data = {
      nome: req.body.nome,
      email: req.body.email,
      idade: req.body.idade,
      genero: req.body.genero || '',
      interesses: req.body.interesses || [],
      mensagem: req.body.mensagem,
      aceite: req.body.aceite === 'on'
    };

    if (!errors.isEmpty()) {
      // Mapeamos erros por campo para facilitar no EJS
      const mapped = errors.mapped(); // { campo: { msg, param, ... } }
      return res.status(400).render('contato', {
        title: 'Formulário de Contato',
        data,
        errors: mapped,
        method: 'post',
        action: '/contato'
      });
    }

    const stmt = db.prepare(`
        INSERT INTO contatos (nome, email, idade, genero, interesses, mensagem, aceite)
        VALUES (@nome, @email, @idade, @genero, @interesses, @mensagem, @aceite)
    `);
    
    stmt.run({
      nome: data.nome,
      email: data.email,
      idade: data.idade || null,
      genero: data.genero || null,
      interesses: Array.isArray(data.interesses)
        ? data.interesses.join(',')
        : (data.interesses || ''),
      mensagem: data.mensagem,
      aceite: data.aceite ? 1 : 0
    });

    // Aqui você poderia persistir no banco, enviar e-mail, etc.

    return res.render('sucesso', {
      title: 'Enviado com sucesso',
      data
    });
  }
);

// GET /contato/lista - tabela com os contatos cadastrados
router.get('/lista', (req, res) => {
  const rows = db.prepare(`
    SELECT id, nome, email, idade, genero, interesses, mensagem, criado_em
    FROM contatos
    ORDER BY criado_em DESC
  `).all();

  res.render('contatos-lista', {
    title: 'Lista de Contatos',
    contatos: rows
  });
});

// POST /contato/:id/delete - Exclui contato pelo ID
router.post('/:id/delete', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    // ID inválido - só volta
    return res.redirect('/contato/lista');
  }

  const info = db.prepare('DELETE FROM contatos WHERE id = ?').run(id);

  // Opcional: testar se algo foi deletado
  if (info.changes == 0) { console.log('Nenhum registro com esse ID'); }

  return res.redirect('/contato/lista');
});

// GET /contato/:id/edit - retorna lista de contatos para editar
router.get('/:id/edit', (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  if ( Number.isNaN(id) ) {
    // ID inválido - só volta
    return res.redirect('/contato/lista');
  }

  const row = db.prepare('SELECT id, nome, email, idade, genero, interesses, mensagem, aceite FROM contatos WHERE id = ?').get(id);
  if (!row) {
    return res.redirect('/contato/lista');
  }

  const data = {
    nome: row.nome,
    email: row.email,
    idade: row.idade,
    genero: row.genero || '',
    interesses: row.interesses ? row.interesses.split(',') : [],
    mensagem: row.mensagem,
    aceite: !!row.aceite
  };

  res.render('contato', {
    title: 'Editar Contato',
    data,
    errors: {},
    action: `/contato/${id}/update`,
    method: 'post'
  });
});

router.post('/:id/update', contatoValidators, (req, res) => {
  const id = parseInt(req.params.id, 10);

  if ( Number.isNaN(id) ) {
    // ID inválido - só volta
    return res.redirect('contato/lista');
  }

  const errors = validationResult(req);
  const data = {
    nome: req.body.nome,
    email: req.body.email,
    idade: req.body.idade,
    genero: req.body.genero || '',
    interesses: req.body.interesses || [],
    mensagem: req.body.mensagem,
    aceite: req.body.aceite === 'on'
  };

  if (!errors.isEmpty()) {
    const mapped = errors.mapped();
    return res.status(400).render('contato', {
      title: 'Editar Contato',
      data,
      errors: mapped,
      action: `/contato/${id}/update`,
      method: 'post'
    });
  }


  const info = db.prepare(`
    UPDATE contatos
    SET nome = @nome, email = @email, idade = @idade, genero = @genero,
        interesses = @interesses, mensagem = @mensagem
    WHERE id = @id
  `).run({
    id,
    nome: data.nome,
    email: data.email,
    idade: data.idade || null,
    genero: data.genero || null,
    interesses: Array.isArray(data.interesses) ? data.interesses.join(',') : (data.interesses || ''),
    mensagem: data.mensagem,
    aceite: data.aceite ? 1 : 0
  });

  res.redirect('/contato/lista');
});

module.exports = router;