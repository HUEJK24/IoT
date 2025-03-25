const express = require("express");
const cors = require("cors"); // <-- Importar cors

const app = express();
const PORT = 3000;

// Habilitar CORS para todas las rutas
app.use(cors()); // <-- uso de cors

app.use(express.json());

// Arrays para el historial
// Cada elemento tendrá { timestamp, entrada, salida } o { timestamp, distancia }
let historialPIR = [];
let historialDist = [];

// Cuando llega POST /datos (Maestro envía PIR)
app.post("/datos", (req, res) => {
  const { entrada, salida } = req.body;

  // Generar registro con fecha/hora
  const registro = {
    timestamp: new Date().toISOString(),
    entrada: entrada,
    salida: salida
  };
  // Agregar al frente del array
  historialPIR.unshift(registro);

  // Log en la consola
  console.log("=== Nuevo dato PIR del Maestro ===");
  console.log(registro);
  console.log("====================================\n");

  res.send("Datos PIR recibidos con éxito");
});

// Cuando llega POST /distancia (Xiao envía su RSSI/dDistancia)
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

// Endpoint para obtener el historial PIR
app.get("/historialPIR", (req, res) => {
  res.json(historialPIR);
});

// Endpoint para obtener el historial Distancia
app.get("/historialDist", (req, res) => {
  res.json(historialDist);
});

// (Opcional) ver el servidor
app.get("/", (req, res) => {
  res.send("Servidor arriba y funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
