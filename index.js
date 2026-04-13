const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

// 🔓 Libera acesso do seu site (GitHub Pages)
app.use(cors());

// 🔄 Permite receber JSON do formulário
app.use(express.json());

// 🔗 SUA STRING DO MONGO (já coloquei a sua)
const uri = "mongodb+srv://admin:24404743aA@cadastro-db.6foo4fb.mongodb.net/?retryWrites=true&w=majority&appName=cadastro-db";

const client = new MongoClient(uri);

let collection;

// 🔌 Conecta no MongoDB
async function conectar() {
    try {
        await client.connect();
        const db = client.db("cadastro"); // nome do banco
        collection = db.collection("clientes"); // nome da coleção

        console.log("✅ Conectado ao MongoDB");
    } catch (erro) {
        console.error("❌ Erro ao conectar no Mongo:", erro);
    }
}

conectar();

// 🚀 ROTA PRINCIPAL (ESSA É A QUE ESTAVA FALTANDO)
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

// 🧪 ROTA DE TESTE (abre no navegador)
app.get('/', (req, res) => {
    res.send("API rodando 🚀");
});

// 🌍 PORTA (Render usa isso)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
