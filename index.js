const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let ultimoEstado = { entrada: 0, salida: 0 };

app.post("/registro", (req, res) => {
    const { entrada, salida } = req.body;
    ultimoEstado = { entrada, salida };
    console.log(`Entrada: ${entrada}, Salida: ${salida}`);
    res.sendStatus(200);
});

app.get("/datos", (req, res) => {
    res.json(ultimoEstado);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
