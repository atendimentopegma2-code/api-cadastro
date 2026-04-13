const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

/* ============================= */
/* CONEXÃO MONGODB */
/* ============================= */
mongoose.connect('mongodb+srv://admin:24404743aA@cadastro-db.6foo4fb.mongodb.net/cadastro?retryWrites=true&w=majority')
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log(err));

/* ============================= */
/* MODELO */
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
/* ROTA PRINCIPAL (IMPORTANTE) */
/* ============================= */
app.get('/', (req, res) => {
    res.send("API ONLINE 🚀");
});

/* ============================= */
/* SALVAR */
/* ============================= */
app.post('/salvar', async (req, res) => {
    try {
        const novo = new Cadastro(req.body);
        await novo.save();
        res.json({ status: "salvo no banco" });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

/* ============================= */
/* LISTAR */
/* ============================= */
app.get('/listar', async (req, res) => {
    const dados = await Cadastro.find();
    res.json(dados);
});

/* ============================= */
/* PORTA (OBRIGATÓRIO) */
/* ============================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando");
});
