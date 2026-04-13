const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://admin:24404743aA@cadastro-db.6foo4fb.mongodb.net/?retryWrites=true&w=majority&appName=cadastro-db";

const client = new MongoClient(uri);

let db;

// 🔌 Conecta ANTES de subir o servidor
async function startServer() {
    try {
        await client.connect();
        console.log("✅ Mongo conectado");

        db = client.db("cadastro");

        // 🚀 rota salvar
        app.post('/salvar', async (req, res) => {
            try {
                const dados = req.body;

                if (!dados) {
                    return res.status(400).json({ erro: "Dados inválidos" });
                }

                await db.collection("clientes").insertOne(dados);

                res.json({ mensagem: "Salvo com sucesso" });

            } catch (erro) {
                console.error("Erro ao salvar:", erro);
                res.status(500).json({ erro: "Erro ao salvar" });
            }
        });

        // rota teste
        app.get('/', (req, res) => {
            res.send("API rodando 🚀");
        });

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Rodando na porta ${PORT}`);
        });

    } catch (erro) {
        console.error("❌ Erro ao conectar Mongo:", erro);
    }
}

startServer();
