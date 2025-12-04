const { createSequelizeInstance } = require('../infra/db/sequelize');
const { defineContatoModel } = require('../infra/db/models/ContatoModel');
const ContatoRepositorySequelize = require('../infra/repositories/ContatoRepositorySequelize');
const ContatoService = require('../application/services/ContatoServices');

const sequelize = createSequelizeInstance();
const ContatoModel = defineContatoModel(sequelize);

sequelize.sync()
    .then(() => console.log('Banco sincronizado com Sequelize (ORM).'))
    .catch(err => console.error('Erro ao sincronizar banco:', err));

    const contatoRepository = new ContatoRepositorySequelize(ContatoModel);
    const contatoService = new ContatoService(contatoRepository);

    module.exports = {
        sequelize,
        ContatoModel,
        contatoRepository,
        contatoService
    };