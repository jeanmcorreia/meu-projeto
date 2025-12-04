PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    idade INTEGER,
    genero TEXT,
    interesses TEXT,
    mensagem TEXT NOT NULL,
    aceite INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
