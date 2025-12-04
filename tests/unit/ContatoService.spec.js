const ContatoService = require('../../application/services/ContatoServices');
const FakeRepo = require('../testUtils/fakeContatoRepository');

describe('ContatoService (unit)', () => {
    test('criar → listar → atualizar → excluir', async () => {
        const repo = new FakeRepo();
        const service = new ContatoService(repo);

        const c = await service.criar({
            nome: 'Ana Teste', email: 'ana@ex.com', idade: 30, genero: '', interesses: ['node', 'ejs'], mensagem: 'Olá mundo!', aceite: true
        });
    expect (c.id).toBeDefined();

    const lista1 = await service.listar();
    expect(lista1.length).toBe(1);

    const upd = await service.atualizar(c.id, { nome: 'Ana Atualizada' });
    expect(upd.nome).toBe('Ana Atualizada');

    await service.excluir(c.id);
    const lista2 = await service.listar();
    expect(lista2.length).toBe(0);
    });
});