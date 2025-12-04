const fs = require('fs');
const path = require('path');
const os = require('os');
const { createSqliteDb } = require('../../infra/db/sqliteFactory');
const ContatoRepositorySqlite = require('../../infra/repositories/ContatoRepositorySqlite');
const ContatoService = require('../../application/services/ContatoServices');

function createTmpDbPath() {
    const file = path.join(os.tmpdir(), `contatos-test-${Date.now()}-${Math.random()}.db`);
    return file;
}

function buildServiceWithTmpDb() {
    const dbPath = createTmpDbPath();
    const db = createSqliteDb(dbPath);
    const repo = new ContatoRepositorySqlite(db);
    const service = new ContatoService(repo);
    return { db, repo, service, dbPath };
}

module.exports = { buildServiceWithTmpDb };