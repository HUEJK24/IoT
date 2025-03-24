const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Endpoint donde el Maestro envía datos de sus PIR
app.post("/datos", (req, res) => {
  const { entrada, salida } = req.body;
  console.log("Datos recibidos del ESP32 Maestro (PIR):");
  console.log(`  Entrada = ${entrada}`);
  console.log(`  Salida  = ${salida}`);
  res.send("Datos PIR recibidos con éxito");
});

// Endpoint donde el Xiao envía su distancia WiFi
app.post("/distancia", (req, res) => {
  const { distancia } = req.body;
  console.log("Datos recibidos del Xiao (distancia WiFi):");
  console.log(`  Distancia = ${distancia}`);
  res.send("Distancia recibida con éxito");
});

// (Opcional) Para probar que el servidor está arriba
app.get("/", (req, res) => {
  res.send("Servidor arriba y funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
