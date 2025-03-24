const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Endpoint donde el Maestro envía datos de sus PIR
app.post("/datos", (req, res) => {
  const { entrada, salida } = req.body;

  console.log("=== Datos recibidos del ESP32 Maestro (PIR) ===");
  console.log(`  entrada: ${entrada}`);
  console.log(`  salida : ${salida}`);

  // Interpretar la combinación en base a la lógica que programaste en el Arduino:
  // - (1,0) => “Persona ENTRO”
  // - (0,1) => “Persona SALIO”
  // - (1,1) => se encendieron ambos sensores, depende de tu uso (podría darse un caso especial)
  // - (0,0) => sin detección
  let interpretacion = "";

  if (entrada === 1 && salida === 0) {
    interpretacion = "PERSONA ENTRO (Entrada=1, Salida=0)";
  } else if (entrada === 0 && salida === 1) {
    interpretacion = "PERSONA SALIO (Entrada=0, Salida=1)";
  } else if (entrada === 1 && salida === 1) {
    interpretacion = "AMBOS SENSORES ACTIVOS (revisa la lógica del Maestro)";
  } else {
    interpretacion = "SIN MOVIMIENTO (Entrada=0, Salida=0)";
  }

  console.log(`  Interpretación: ${interpretacion}`);
  console.log("------------------------------------------------\n");

  res.send("Datos PIR recibidos con éxito");
});

// Endpoint donde el Xiao envía su distancia WiFi
app.post("/distancia", (req, res) => {
  const { distancia } = req.body;

  console.log("=== Datos recibidos del Xiao (distancia WiFi) ===");
  console.log(`  Distancia = ${distancia}`);
  console.log("------------------------------------------------\n");

  res.send("Distancia recibida con éxito");
});

// (Opcional) Para probar que el servidor está arriba
app.get("/", (req, res) => {
  res.send("Servidor arriba y funcionando");
});

// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
