const ContatoRepository = require('../../domain/ports/ContatoRepository');

const Contato = require('../../domain/entities/Contato');

class ContatoRepositorySequelize extends ContatoRepository {

    /**
     * @param {Model} ContatoModel 
     */

    constructor(ContatoModel) {

        super();

        this.ContatoModel = ContatoModel;
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

        const row = await this.ContatoModel.create({
            nome: contato.nome, 
            email: contato.email, 
            idade: contato.idade || null, 
            genero: contato.genero || null, 
            interesses, 
            mensagem: contato.mensagem, 
            aceite: contato.aceite
        });

        return this._rowToEntity(row.toJSON());
    }

    async update(contato) {
        const interesses = Array.isArray(contato.interesses) ? contato.interesses.join(',') : (contato.interesses || '');

        await this.ContatoModel.update({
            nome: contato.nome, 
            email: contato.email, 
            idade: contato.idade || null, 
            genero: contato.genero || null, 
            interesses, 
            mensagem: contato.mensagem, 
            aceite: contato.aceite
        }, {
            where: { id: contato.id }
        });

        const row = await this.ContatoModel.findByPk(contato.id);

        return this._rowToEntity(row ? row.toJSON() : null);
    }

    async deleteById(id) {
        await this.ContatoModel.destroy({ where: { id } } );
    }

    async findAll() {
        const rows = await this.ContatoModel.findAll({ order: [['criado_em', 'DESC']] });
        return rows.map(r => this._rowToEntity(r.toJSON()));
    }

    async findById(id) {
        const row = await this.ContatoModel.findByPk(id);
        return this._rowToEntity(row ? row.toJSON() : null);
    }
}

module.exports = ContatoRepositorySequelize;