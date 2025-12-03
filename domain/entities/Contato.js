class Contato {
    
    constructor({ id = null, nome, email, idade = null, genero = '', interesses = [], mensagem, aceite= false, criadoEm = null })
{
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.idade = idade;
    this.genero = genero || '';
    this.interesses = Array.isArray(interesses) ? interesses : (interesses ? String(interesses).split(',') : []);
    this.mensagem = mensagem;
    this.aceite = !!aceite;
    this.criadoEm = criadoEm; // Date|string
    }
}

module.exports = Contato;