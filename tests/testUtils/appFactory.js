const express = require('express');
const path = require('path');
const contatoRoutes = require('../../routes/contato');
const errorHandler = require('../../middlewares/errorHandler');

function buildApp() {
    const app = express();
    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({ extended: false }));
    app.use('/contato', contatoRoutes);
    app.use(errorHandler);
    return app;
}

module.exports = { buildApp };