const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

// 🔓 Libera acesso (CORS)
app.use(cors());

// 🔄 Permite JSON
app.use(express.json());

// 🔗 SUA CONEXÃO (depois troque a senha por segurança)
const uri = "mongodb+srv://admin:24404743aA@cadastro-db.6foo4fb.mongodb.net/?retryWrites=true&w=majority&appName=cadastro-db";

const client = new MongoClient(uri);

let collection;

// 🔌 CONEXÃO COM MONGO (ROBUSTA)
async function iniciarServidor() {
    try {
        await client.connect();

        const db = client.db("cadastro");
        collection = db.collection("clientes");

        console.log("✅ Mongo conectado");

        // 🚀 ROTA SALVAR
        app.post('/salvar', async (req, res) => {
            try {

                if (!collection) {
                    return res.status(500).json({ erro: "Banco não conectado" });
                }

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

        // 🧪 ROTA TESTE
        app.get('/', (req, res) => {
            res.send("API rodando 🚀");
        });

        // 🌍 PORTA
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });

    } catch (erro) {
        console.error("❌ ERRO AO INICIAR:", erro);
    }
}

iniciarServidor();
