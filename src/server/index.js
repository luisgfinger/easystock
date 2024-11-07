const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const app = express();
const cors = require("cors");
const port = 3001;

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("imagem"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});


const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    db.run("PRAGMA foreign_keys = ON;");
    console.log("Conectado ao banco de dados SQLite.");
  }
});


db.run(` 
  CREATE TABLE IF NOT EXISTS fornecedor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    contato TEXT NOT NULL,
    endereco TEXT NOT NULL
  );`);

db.run(`  
  CREATE TABLE IF NOT EXISTS cliente(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  contato TEXT NOT NULL,
  endereco TEXT NOT NULL
  );`);

db.run(`
  CREATE TABLE IF NOT EXISTS produto(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    preco FLOAT NOT NULL,
    quantidade INTEGER NOT NULL,
    imagem TEXT NOT NULL,
    fornecedorId INTEGER,
    FOREIGN KEY(fornecedorId) REFERENCES fornecedor(id)
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS pedido(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data DATE,
  fornecedorId INTEGER,
  status TEXT,
  total FLOAT,
  FOREIGN KEY(fornecedorId) REFERENCES fornecedor(id)
  );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS itemPedido(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedidoId INTEGER,
    produtoId INTEGER,
    quantidade INTEGER,
    precoUnitario FLOAT,
    entrada BOOLEAN,
    FOREIGN KEY (pedidoId) REFERENCES pedido(id),
    FOREIGN KEY (produtoId) REFERENCES produto(id)
    );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS transacao(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data DATE,
      tipo TEXT,
      valor FLOAT,
      produtoId INTEGER,
      pedidoId INTEGER,
      FOREIGN KEY(produtoId) REFERENCES produto(id),
      FOREIGN KEY (pedidoId) REFERENCES pedido(id)
      );
      `);

    db.run(`
      CREATE TABLE IF NOT EXISTS usuario(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      senha TEXT NOT NULL,
      admin BOOLEAN 
      );
      `);

app.get("/api/fornecedor", (req, res) => {
  db.all("SELECT * FROM fornecedor", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/fornecedor", (req, res) => {
  const { nome, cnpj, contato, endereco } = req.body;
  db.run(
    "INSERT INTO fornecedor (nome, cnpj, contato, endereco) VALUES (?, ?, ?, ?)",
    [nome, cnpj, contato, endereco],
    function (err) {
      if (err) {
        console.error("Erro ao inserir fornecedor:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put("/api/fornecedor/:id", (req, res) => {
  const { id } = req.params;
  const { nome, cnpj, contato, endereco } = req.body;
  db.run(
    "UPDATE fornecedor SET nome = ?, cnpj = ?, contato = ?, endereco = ? WHERE id = ?",
    [nome, cnpj, contato, endereco, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updatedRows: this.changes });
    }
  );
});

app.delete("/api/fornecedor/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM fornecedor WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedRows: this.changes });
  });
});


app.get("/api/cliente", (req, res) => {
  db.all("SELECT * FROM cliente", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/cliente", (req, res) => {
  const { nome, cpf_cnpj, contato, endereco } = req.body;
  db.run(
    "INSERT INTO cliente (nome, cpf_cnpj, contato, endereco) VALUES (?, ?, ?, ?)",
    [nome, cpf_cnpj, contato, endereco],
    function (err) {
      if (err) {
        console.error("Erro ao inserir cliente:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put("/api/cliente/:id", (req, res) => {
  const { id } = req.params;
  const { nome, cpf_cnpj, contato, endereco } = req.body;
  db.run(
    "UPDATE cliente SET nome = ?, cpf_cnpj = ?, contato = ?, endereco = ? WHERE id = ?",
    [nome, cpf_cnpj, contato, endereco, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updatedRows: this.changes });
    }
  );
});

app.delete("/api/cliente/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM cliente WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedRows: this.changes });
  });
});


app.get("/api/produto", (req, res) => {
  db.all("SELECT * FROM produto", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/produto", (req, res) => {
  const { nome, descricao, preco, quantidade, imagem, fornecedorId } = req.body;
  db.run(
    "INSERT INTO produto (nome, descricao, preco, quantidade, imagem, fornecedorId) VALUES (?, ?, ?, ?, ?, ?)",
    [nome, descricao, preco, quantidade, imagem, fornecedorId],
    function (err) {
      if (err) {
        console.error("Erro ao inserir produto:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put("/api/produto/:id", (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, quantidade, imagem, fornecedorId } = req.body;
  db.run(
    "UPDATE produto SET nome = ?, descricao = ?, preco = ?, quantidade = ?, imagem = ?, fornecedorId = ? WHERE id = ?",
    [nome, descricao, preco, quantidade, imagem, fornecedorId, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updatedRows: this.changes });
    }
  );
});


app.delete("/api/produto/:id", (req, res) => {
  const { id } = req.params;


  db.get("SELECT imagem FROM produto WHERE id = ?", id, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }


    const imagePath = `.${row.imagem}`;

 
    db.run("DELETE FROM produto WHERE id = ?", id, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      fs.unlink(imagePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Erro ao deletar a imagem:", unlinkErr);
        }
        res.json({ deletedRows: this.changes });
      });
    });
  });
});

app.get("/api/pedido", (req, res) => {
  db.all("SELECT * FROM pedido", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/pedido", (req, res) => {
  const { data, fornecedorId, status, total } = req.body;
  db.run(
    "INSERT INTO pedido (data, fornecedorId, status, total) VALUES (?, ?, ?, ?)",
    [data, fornecedorId, status, total],
    function (err) {
      if (err) {
        console.error("Erro ao inserir pedido:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put("/api/pedido/:id", (req, res) => {
  const { id } = req.params;
  const { data, fornecedorId, status, total } = req.body;
  db.run(
    "UPDATE pedido SET data = ?, fornecedorId = ?, status = ?, total = ? WHERE id = ?",
    [data, fornecedorId, status, total, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updatedRows: this.changes });
    }
  );
});

app.delete("/api/pedido/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM pedido WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedRows: this.changes });
  });
});

app.get("/api/itempedido", (req, res) => {
  db.all("SELECT * FROM itemPedido", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/itempedido", (req, res) => {
  const { pedidoId, produtoId, quantidade, precoUnitario, entrada } = req.body;

  db.run(
    "INSERT INTO itemPedido (pedidoId, produtoId, quantidade, precoUnitario, entrada) VALUES (?, ?, ?, ?, ?)",
    [pedidoId, produtoId, quantidade, precoUnitario, entrada],
    function (err) {
      if (err) {
        console.error("Erro ao inserir itemPedido:", err);
        res.status(500).json({ error: err.message });
        return;
      }

      const quantidadeAdjustment = entrada ? quantidade : -quantidade;

      db.run(
        "UPDATE produto SET quantidade = quantidade + ? WHERE id = ?",
        [quantidadeAdjustment, produtoId],
        function (err) {
          if (err) {
            console.error("Erro ao atualizar quantidade do produto:", err);
            res.status(500).json({ error: err.message });
            return;
          }

          res.json({ id: this.lastID });
        }
      );
    }
  );
});


app.put("/api/itempedido/:id", (req, res) => {
  const { id } = req.params;
  const { pedidoId, produtoId, quantidade, precoUnitario, entrada } = req.body;
  db.run(
    "UPDATE itemPedido SET pedidoId = ?, produtoId = ?, quantidade = ?, precoUnitario = ?, entrada = ? WHERE id = ?",
    [pedidoId, produtoId, quantidade, precoUnitario, entrada, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updatedRows: this.changes });
    }
  );
});

app.delete("/api/itempedido/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM itemPedido WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedRows: this.changes });
  });
});

app.get("/api/transacao", (req, res) => {
  db.all("SELECT * FROM transacao", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/transacao", (req, res) => {
  const { data, tipo, valor, produtoId, pedidoId } = req.body;
  db.run(
    "INSERT INTO transacao (data, tipo, valor, produtoId, pedidoId) VALUES (?, ?, ?, ?, ?)",
    [data, tipo, valor, produtoId, pedidoId],
    function (err) {
      if (err) {
        console.error("Erro ao inserir transacao:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put("/api/transacao/:id", (req, res) => {
  const { id } = req.params;
  const { data, tipo, valor, produtoId, pedidoId} = req.body;
  db.run(
    "UPDATE transacao SET data = ?, tipo = ?, valor = ?, produtoId = ?, pedidoId = ? WHERE id = ?",
    [data, tipo, valor, produtoId, pedidoId, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updatedRows: this.changes });
    }
  );
});

app.delete("/api/transacao/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM transacao WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedRows: this.changes });
  });
});

app.get("/api/usuario", (req, res) => {
  db.all("SELECT * FROM usuario", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/usuario", (req, res) => {
  const { nome, email, senha, admin } = req.body;
  db.run(
    "INSERT INTO usuario (nome, email, senha, admin) VALUES (?, ?, ?, ?)",
    [nome, email, senha, admin],
    function (err) {
      if (err) {
        console.error("Erro ao inserir usuario:", err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put("/api/usuario/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, admin} = req.body;
  db.run(
    "UPDATE usuario SET nome = ?, email = ?, senha = ?, admin = ?  WHERE id = ?",
    [nome, email, senha, admin, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updatedRows: this.changes });
    }
  );
});

app.delete("/api/usuario/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM usuario WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deletedRows: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
