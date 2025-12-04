const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

function createSequelizeInstance(dbFilePath) {
    const dataDir = path.join(process.cwd(), 'data');

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    const dbPath = dbFilePath || path.join(dataDir, 'contatos-orm.db');
    
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: false
    });

    return sequelize;
}

module.exports = { createSequelizeInstance };