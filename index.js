const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Habilitar CORS y parseo de JSON
app.use(cors());
app.use(express.json());

// Arrays para almacenar el historial de datos
let historialPIR = [];
let historialDist = [];

// Endpoint para recibir datos PIR (envíados por el Arduino Maestro)
app.post("/datos", (req, res) => {
  const { entrada, salida } = req.body;

  const registro = {
    timestamp: new Date().toISOString(),
    entrada: entrada,
    salida: salida
  };
  historialPIR.unshift(registro);

  console.log("=== Nuevo dato PIR del Maestro ===");
  console.log(registro);
  console.log("====================================\n");

  res.send("Datos PIR recibidos con éxito");
});

// Endpoint para recibir datos de distancia (reenviados desde el Arduino Maestro, originalmente del Xiao)
app.post("/distancia", (req, res) => {
  const { distancia } = req.body;

  const registro = {
    timestamp: new Date().toISOString(),
    distancia: distancia
  };
  historialDist.unshift(registro);

  console.log("=== Nueva distancia del Xiao ===");
  console.log(registro);
  console.log("=================================\n");

  res.send("Distancia recibida con éxito");
});

// (Opcional) Endpoints para obtener todo el historial
app.get("/historialPIR", (req, res) => {
  res.json(historialPIR);
});

app.get("/historialDist", (req, res) => {
  res.json(historialDist);
});

// Endpoints para obtener el último registro (lo que usará la app Flutter)
app.get("/ultimadistancia", (req, res) => {
  res.json(historialDist[0] || {});
});

app.get("/ultimopir", (req, res) => {
  res.json(historialPIR[0] || {});
});

// Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Servidor arriba y funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
