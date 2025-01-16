const express = require('express');
const path = require('path'); // Importa el módulo path
const cors = require('cors'); // Importa el módulo cors
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors()); // Configura CORS
app.use(express.json());
// Configuración para servir archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname)));


// Handle the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Enviar index.html
});

// Handle the chat path
app.post('/api/chat', async (req, res) => {
      res.status(200).json({ response: "Hola, soy un bot", chatld: "123", chatHistory: [] });
});
// Handle the contact path
app.post('/api/contact', async (req, res) => {
  res.status(201).json({ message: 'Consulta guardada con éxito' });
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
module.exports = app;