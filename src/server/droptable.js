const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      console.error("Erro ao conectar ao banco de dados:", err);
    } else {
      console.log("Conectado ao banco de dados SQLite.");
    }
  });

db.run("DROP TABLE IF EXISTS pedido", (err) => {
    if (err) {
      console.error("Erro ao excluir tabela:", err);
    } else {
      console.log("Tabela 'fornecedor' excluída com sucesso.");
    }
  });

db.run("DROP TABLE IF EXISTS itemPedido");

db.run("DROP TABLE IF EXISTS transacao");
  