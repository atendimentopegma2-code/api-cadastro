const express = require('express');
const app = express();

app.use(express.json());

app.post('/salvar', (req, res) => {
    console.log(req.body);
    res.json({ status: "salvo" });
});

app.get('/', (req, res) => {
    res.send("API ONLINE");
});

app.listen(3000, () => {
    console.log("Rodando");
});
