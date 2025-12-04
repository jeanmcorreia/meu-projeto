const request = require('supertest');
const { buildApp } = require('../testUtils/appFactory');
const path = require('path');
const fs = require('fs');
const os = require('os');

function tmpDb() {
    return path.join(os.tmpdir(), `contatos-e2e-${Date.now()}-${Math.random()}.db`);
}

describe('Contato routes (e2e)', () => {
    let app;
    let prev;

    beforeAll(() => {
        prev = process.env.TEST_DB_PATH;
        process.env.TEST_DB_PATH = tmpDb();
        app = buildApp();
    });

    afterAll(() => {
        if (prev === undefined) delete process.env.TEST_DB_PATH;
        else process.env.TEST_DB_PATH = prev;
    });

    test('POST /contato cria e retorna sucesso', async () => {
        const res = await request(app)
            .post('/contato')
            .type('form')
            .send({
                nome: 'João da Silva',
                email: 'joao@example.com',
                idade: 25,
                genero: '',
                interesses: ['node', 'backend'],
                mensagem: 'Mensagem válida aqui!',
                aceite: 'on'
            });

        expect(res.status).toBe(200);
        expect(res.text).toContain('Enviado com sucesso');
        expect(res.text).toContain('João da Silva');
    });

    test('GET /contato/lista exibe tabela com pelo menos 1 contato', async() => {
        const res = await request(app).get('/contato/lista');
        expect(res.status).toBe(200);
        expect(res.text).toContain('<table');
    });
});