const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const arquivoClientes = path.join(os.tmpdir(), 'clientes-api-cadastro.json');

let client;
let collection;
let bancoDisponivel = false;

async function conectar() {
    if (!uri) {
        console.warn('MONGODB_URI nao configurada. Usando armazenamento local temporario.');
        return;
    }

    try {
        client = new MongoClient(uri);
        await client.connect();
        const db = client.db('cadastro');
        collection = db.collection('clientes');
        bancoDisponivel = true;

        console.log('Conectado ao MongoDB');
    } catch (erro) {
        bancoDisponivel = false;
        console.error('Erro ao conectar no MongoDB. Usando armazenamento local temporario:', erro.message);
    }
}

async function lerClientesLocais() {
    try {
        const conteudo = await fs.readFile(arquivoClientes, 'utf8');
        return JSON.parse(conteudo);
    } catch (erro) {
        if (erro.code === 'ENOENT') return [];
        throw erro;
    }
}

async function salvarClienteLocal(dados) {
    const clientes = await lerClientesLocais();
    const cliente = {
        ...dados,
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        salvoEm: new Date().toISOString(),
        origem: 'armazenamento-local'
    };

    clientes.push(cliente);
    await fs.writeFile(arquivoClientes, JSON.stringify(clientes, null, 2), 'utf8');
    return cliente;
}

function validarCadastro(dados) {
    if (!dados || typeof dados !== 'object') return false;
    return Boolean(dados.nome && dados.cep && dados.cpf);
}

conectar();

/* ================= SALVAR ================= */
app.post('/salvar', async (req, res) => {
    const dados = req.body;

    if (!validarCadastro(dados)) {
        return res.status(400).json({ erro: 'Preencha nome, CEP e CPF.' });
    }

    try {
        if (bancoDisponivel && collection) {
            await collection.insertOne({
                ...dados,
                salvoEm: new Date().toISOString(),
                origem: 'mongodb'
            });

            return res.status(200).json({ mensagem: 'Salvo com sucesso!' });
        }

        await salvarClienteLocal(dados);
        return res.status(200).json({ mensagem: 'Salvo com sucesso!' });
    } catch (erro) {
        console.error('Erro ao salvar no banco. Tentando armazenamento local:', erro.message);

        try {
            await salvarClienteLocal(dados);
            return res.status(200).json({ mensagem: 'Salvo com sucesso!' });
        } catch (erroLocal) {
            console.error('Erro ao salvar localmente:', erroLocal.message);
            return res.status(500).json({ erro: 'Erro ao salvar cadastro.' });
        }
    }
});

/* ================= LISTAR CLIENTES ================= */
app.get('/clientes', async (req, res) => {
    try {
        if (bancoDisponivel && collection) {
            const dados = await collection.find().toArray();
            return res.json(dados);
        }

        const dados = await lerClientesLocais();
        return res.json(dados);
    } catch (erro) {
        console.error('Erro ao buscar dados:', erro.message);
        return res.status(500).json({ erro: 'Erro ao buscar dados.' });
    }
});

/* ================= STATUS ================= */
app.get('/status', async (req, res) => {
    res.json({
        api: 'online',
        banco: bancoDisponivel ? 'mongodb' : 'armazenamento-local-temporario'
    });
});

/* ================= TESTE ================= */
app.get('/', (req, res) => {
    res.send('API rodando');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
