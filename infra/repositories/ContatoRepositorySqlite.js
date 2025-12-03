const ContatoRepository = require('../../domain/ports/ContatoRepository');

const Contato = require('../../domain/entities/Contato');

class ContatoRepositorySqlite extends ContatoRepository {

    constructor(db) {

        super();

        this.db = db;
        this.stmts = {
            insert: this.db.prepare(`
                INSERT INTO contatos (nome, email, idade, genero, interesses, mensagem, aceite)

                VALUES (@nome, @email, @idade, @genero, @interesses, @mensagem, @aceite)
            `),
            update: this.db.prepare(`
                UPDATE contatos
                SET nome=@nome, email=@email, idade=@idade, genero=@genero, interesses=@interesses, mensagem=@mensagem, aceite=@aceite
                WHERE id=@id
            `),
            delete: this.db.prepare(`DELETE FROM contatos WHERE id=?`),

            findAll: this.db.prepare(`
                SELECT id, nome, email, idade, genero, interesses, mensagem, criado_em, aceite
                FROM contatos ORDER BY criado_em DESC    
            `),

            findById: this.db.prepare(`
                SELECT id, nome, email, idade, genero, interesses, mensagem, criado_em, aceite
                FROM contatos WHERE id=?    
            `),
        };
    }

    _rowToEntity(row) {
        if (!row) return null;
        return new Contato({
            id: row.id,
            nome: row.nome,
            email: row.email,
            idade: row.idade,
            genero: row.genero || '',
            interesses: row.interesses ? row.interesses.split(','): [],
            mensagem: row.mensagem,
            aceite: !!row.aceite,
            criadoEm: row.criado_em
        });
    }

    async create(contato) {
        const interesses = Array.isArray(contato.interesses) ? contato.interesses.join(',') : (contato.interesses || '');
        const info = this.stmts.insert.run({
            nome: contato.nome, email: contato.email, idade: contato.idade || null, genero: contato.genero || null, interesses, mensagem: contato.mensagem, aceite: contato.aceite ? 1 : 0
        });
        return this.findById(info.lastInsertRowid);
    }

    async update(contato) {
        const interesses = Array.isArray(contato.interesses) ? contato.interesses.join(',') : (contato.interesses || '');

        this.stmts.update.run({
            id: contato.id, nome: contato.nome, email: contato.email, idade: contato.idade || null, genero: contato.genero || null, interesses, mensagem: contato.mensagem, aceite: contato.aceite ? 1 : 0
        });
        return this.findById(contato.id);
    }

    async deleteById(id) {
        this.stmts.delete.run(id);
    }

    async findAll() {
        return this.stmts.findAll.all().map(r => this._rowToEntity(r));
    }

    async findById(id) {
        const row = this.stmts.findById.get(id);
        return this._rowToEntity(row);
    }
}

module.exports = ContatoRepositorySqlite;