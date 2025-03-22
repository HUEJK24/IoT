// Importamos Express (asegurarse de instalar con npm install express)
const express = require('express');
const app = express();
const PORT = 3000;  // Puerto donde escuchará el servidor (ajustable)

// Middleware para parsear cuerpos JSON de peticiones POST
app.use(express.json());

// Variables de estado y configuración
let eventos = [];                          // Historial de eventos registrados
const UMBRAL_DISTANCIA = 2.0;              // Umbral de distancia para área segura (en metros, ajustable)
let fueraDeArea = false;                   // Indicador de si actualmente la persona está fuera del área segura
let ultimaActivacionPIR = null;            // Último sensor PIR activado ("entrada" o "salida")
let tiempoUltimaActivacion = 0;            // Momento (timestamp) de la última activación PIR
const VENTANA_SECUENCIA_MS = 3000;         // Ventana de tiempo para secuencia PIR (3 seg)

// Ruta HTTP POST para recibir los datos del ESP32 maestro
app.post('/datos', (req, res) => {
  // Agregar log de la solicitud entrante
  console.log("Solicitud recibida:");
  console.log(req.headers); // Log de los headers de la solicitud
  console.log(req.body); // Log de los datos recibidos

  const { entrada, salida, distance } = req.body;

  // Validación de los datos
  if (typeof entrada !== 'number' || typeof salida !== 'number' || isNaN(distance)) {
    console.log("Datos inválidos recibidos. Entradas:", entrada, "Salida:", salida, "Distancia:", distance);
    return res.status(400).send('Datos inválidos.');
  }

  // Variables de estado
  const pirEntrada = entrada;
  const pirSalida = salida;
  const distancia = parseFloat(distance);

  // Obtenemos la hora actual para usar en registro
  const ahora = new Date();
  const horaFormateada = ahora.toLocaleString('es-MX');  // formateamos fecha y hora legible en español

  // Variable para determinar si ocurrió un evento y su descripción
  let descripcionEvento = null;

  // 1. Interpretación de secuencia PIR para "Persona ingresó" o "Persona salió"
  if (pirEntrada === 1 || pirSalida === 1) {
    // Si alguno de los sensores está activado en este POST, verificamos la secuencia
    if (ultimaActivacionPIR && (ahora - tiempoUltimaActivacion) <= VENTANA_SECUENCIA_MS) {
      // Hay una activación previa reciente dentro de la ventana de secuencia
      if (ultimaActivacionPIR === 'entrada' && pirSalida === 1) {
        descripcionEvento = 'Persona ingresó';
      } else if (ultimaActivacionPIR === 'salida' && pirEntrada === 1) {
        descripcionEvento = 'Persona salió';
      }
      // Reiniciamos la última activación para no reutilizarla
      ultimaActivacionPIR = null;
    } else {
      // No hay activación previa reciente: guardamos esta como la última activación potencial
      if (pirEntrada === 1 && pirSalida === 0) {
        ultimaActivacionPIR = 'entrada';
        tiempoUltimaActivacion = ahora;
      } else if (pirSalida === 1 && pirEntrada === 0) {
        ultimaActivacionPIR = 'salida';
        tiempoUltimaActivacion = ahora;
      }
    }
  }

  // 2. Interpretación de distancia para "Persona se aleja del área segura"
  if (!fueraDeArea && distancia > UMBRAL_DISTANCIA) {
    // La persona cruzó el umbral hacia fuera del área segura
    descripcionEvento = 'Persona se aleja del área segura';
    fueraDeArea = true;
  }

  // 3. Si se determinó un evento, lo registramos
  if (descripcionEvento) {
    const evento = {
      evento: descripcionEvento,
      hora: horaFormateada
    };
    eventos.push(evento);
    // Limitar el tamaño de la lista de eventos
    if (eventos.length > 100) {
      eventos.shift(); // elimina el más antiguo si excede 100
    }
    console.log(`[${horaFormateada}] ${descripcionEvento}`);
  } else {
    console.log("No se detectó ningún evento relevante.");
  }

  // Respuesta al ESP32 maestro
  console.log("Enviando respuesta 'OK' al ESP32");
  res.status(200).send('OK');  // Respondemos OK para confirmar recepción
});

// Endpoint GET para obtener los últimos eventos en formato JSON
app.get('/eventos', (req, res) => {
  console.log("Solicitando eventos...");
  res.json(eventos);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Node.js escuchando en puerto ${PORT}`);
});
