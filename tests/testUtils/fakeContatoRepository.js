const ContatoRepository = require('../../domain/ports/ContatoRepository');
const Contato = require('../../domain/entities/Contato');

class FakeContatoRepository extends ContatoRepository {
    constructor() {
        super();
        this._data = [];
        this._id = 1;
    }
    
    async create(contato) {
        const c = new Contato({ ...contato, id: this._id++ });
        this._data.push(c);
        return c;
    }

    async update(contato) {
        const idx = this._data.findIndex(x => x.id === contato.id);
        if (idx === -1) return null;
        const merged = new Contato({ ...this._data[idx], ...contato});
        this._data[idx] = merged;
        return merged;
    }

    async deleteById(id) {
        this._data = this._data.filter(x => x.id !== id);
    }

    async findAll() { return this._data.slice(); }

    async findById(id) { return this._data.find(x => x.id === id) || null; }
}

module.exports = FakeContatoRepository;