const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 SUA STRING
const uri = "mongodb+srv://admin:24404743aA@cadastro-db.6foo4fb.mongodb.net/?retryWrites=true&w=majority&appName=cadastro-db";

let collection;

// 🚀 CONECTA SEM TRAVAR O SERVIDOR
async function conectarMongo() {
    try {
        const client = new MongoClient(uri);
        await client.connect();

        const db = client.db("cadastro");
        collection = db.collection("clientes");

        console.log("✅ Mongo conectado");
    } catch (erro) {
        console.error("❌ Erro Mongo:", erro);
    }
}

// chama sem travar
conectarMongo();

// ✅ ROTA TESTE
app.get('/', (req, res) => {
    res.send("API rodando 🚀");
});

// ✅ ROTA SALVAR
app.post('/salvar', async (req, res) => {
    try {
        if (!collection) {
            return res.status(500).json({ erro: "Banco não conectado" });
        }

        const dados = req.body;

        await collection.insertOne(dados);

        res.json({ sucesso: true });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao salvar" });
    }
});

// 🚀 PORTA
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});
