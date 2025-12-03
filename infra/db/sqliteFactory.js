const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function ensureMigrations(db) {
    
    const sql = fs.readFileSync(path.join(__dirname, 'migrations.sql'), 'utf-8');
    
    db.exec(sql);
}

function createSqliteDb(dbFilePath = null) {

    const baseDir = path.join(process.cwd(), 'data');

    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

    const dbPath = dbFilePath || path.join(baseDir, 'contatos.db');

    ensureMigrations(db);

    return db;
}

module.exports = { createSqliteDb };