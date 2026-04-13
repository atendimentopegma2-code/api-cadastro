const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://admin:24404743aA@cadastro-db.6foo4fb.mongodb.net/?retryWrites=true&w=majority&appName=cadastro-db";

const client = new MongoClient(uri);

let collection;

async function conectar() {
    try {
        await client.connect();
        const db = client.db("cadastro");
        collection = db.collection("clientes");

        console.log("✅ Conectado ao MongoDB");
    } catch (erro) {
        console.error("❌ Erro ao conectar:", erro);
    }
}

conectar();

/* ================= SALVAR ================= */
app.post('/salvar', async (req, res) => {
    try {
        const dados = req.body;

        if (!dados) {
            return res.status(400).json({ erro: "Dados inválidos" });
        }

        await collection.insertOne(dados);

        res.status(200).json({ mensagem: "Salvo com sucesso!" });

    } catch (erro) {
        console.error("Erro ao salvar:", erro);
        res.status(500).json({ erro: "Erro ao salvar" });
    }
});

/* ================= LISTAR CLIENTES ================= */
app.get('/clientes', async (req, res) => {
    try {
        const dados = await collection.find().toArray();
        res.json(dados);
    } catch (erro) {
        console.error("Erro ao buscar:", erro);
        res.status(500).json({ erro: "Erro ao buscar dados" });
    }
});

/* ================= TESTE ================= */
app.get('/', (req, res) => {
    res.send("API rodando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
