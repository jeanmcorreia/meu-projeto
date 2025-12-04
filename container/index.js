const { createSqliteDb } = require('../infra/db/sqliteFactory');
const ContatoRepositorySqlite = require('../infra/repositories/ContatoRepositorySqlite');
const ContatoService = require('../application/services/ContatoServices')

const db = createSqliteDb(process.env.TEST_DB_PATH || undefined); // data/contatos.db
const contatoRepository = new ContatoRepositorySqlite(db);
const contatoService = new ContatoService(contatoRepository);

module.exports = {
    db,
    contatoRepository,
    contatoService
};