const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

/* ============================= */
/* CONEXÃO COM MONGODB */
/* ============================= */
mongoose.connect('mongodb+srv://admin:24404743aA@cadastro-db.6foo4fb.mongodb.net/cadastro?retryWrites=true&w=majority')
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log(err));

/* ============================= */
/* MODELO DO CADASTRO */
/* ============================= */
const Cadastro = mongoose.model('Cadastro', {
    nome: String,
    cep: String,
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    uf: String,
    data: String,
    cpf: String
});

/* ============================= */
/* SALVAR DADOS */
/* ============================= */
app.post('/salvar', async (req, res) => {
    try {
        const novoCadastro = new Cadastro(req.body);
        await novoCadastro.save();
        res.json({ status: "salvo no banco" });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

/* ============================= */
/* LISTAR DADOS */
/* ============================= */
app.get('/listar', async (req, res) => {
    const dados = await Cadastro.find();
    res.json(dados);
});

/* ============================= */
/* TESTE */
/* ============================= */
app.get('/', (req, res) => {
    res.send("API ONLINE COM BANCO 🚀");
});

app.listen(3000, () => {
    console.log("Servidor rodando");
});
