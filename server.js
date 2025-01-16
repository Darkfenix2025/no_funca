const express = require('express');
const { GoogleGenerativeAl } = require("@google/generative-ai");
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


const genAl = new GoogleGenerativeAl(process.env.GEMINI_API_KEY);

// Configuración de Sequelize para SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'legalito.db',
});

// Definir modelo para la tabla Contact
const Contact = sequelize.define('Contact', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING },
    consulta: { type: DataTypes.TEXT, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});
// Sincronizar la base de datos (crea las tablas si no existen)
sequelize.sync()
.then(() => console.log('Base de datos SQLite sincronizada'))
.catch(err => console.error('Error al sincronizar la base de datos:', err));

// Guardar datos del formulario de contacto
app.post('/contact', async (req, res) => {
  try {
    const { nombre, email, telefono, consulta } = req.body;
    await Contact.create({ nombre, email, telefono, consulta });
    res.status(201).json({ message: 'Consulta guardada con éxito' });
  } catch (error) {
    console.error('Error al guardar la consulta:', error);
    res.status(500).json({ error: 'Error al guardar la consulta' });
  }
});
// Chatbot
app.post('/chat', async (req, res) => {
  let { userMessage, chatld, chatHistory} = req.body;
  if (!chatId) {
    chatld = uuidv4();
  }
  chatHistory = chatHistory || [];

  const chatbotPrompt = `Eres un abogado profesional en Argentina, especializado en
derecho laboral, civil y comercial. Tu objetivo principal es responder preguntas legales
de manera clara, precisa y accesible, ayudando a los usuarios a comprender sus
opciones legales y guiándolos hacia una consulta personalizada con Legalito si la
situación lo requiere.
Pautas clave para tus respuestas:
Claridad y formalidad:
Utiliza un lenguaje claro y profesional que sea comprensible incluso para personas sin
conocimientos legales.
Evita el uso de jerga técnica sin explicarla.
Explicaciones prácticas:
Define los términos legales complejos con ejemplos concretos y sencillos.
Relaciona las leyes con situaciones cotidianas que el usuario pueda entender.
Enfoque en resolver dudas:
Responde de forma breve y directa a las preguntas legales, asegurándote de no omitir
información importante.
Si una consulta requiere más contexto o detalles específicos, solicita amablemente los
datos necesarios.
Límites y ética profesional:
Responde únicamente dentro del ámbito del derecho argentino (laboral, civil y
comercial).
No brindes asesoramiento médico, financiero ni relacionado con otras áreas fuera del
alcance legal.
Convocatoria a la acción:
Si no puedes resolver una consulta completamente, informa al usuario de manera
cortés y profesional.
Sugiere que contrate una consulta personalizada con Legalito, explicando cómo el
servicio puede ayudarle con soluciones específicas y detalladas.
Tu propósito es:
Proveer información inicial útil y profesional mientras generas confianza en Legalito
como la mejor opción para resolver problemas legales más complejos o específicos.`;
  const model = genAl.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const chat = model.startChat({
  });
  history: chatHistory,
  try {
    chatHistory.push({role: "user", parts: [{text: userMessage}]}) //Modificación en el
    formato del mensaje
    const result = await chat.sendMessage(`${chatbotPrompt} Usuario:
    ${userMessage}`);
    const response = result.response;
    chatHistory.push({role: "model", parts: [{text:response.text()}]}) //Modificación
    en el formato de la respuesta
    res.json({ response: response.text(), chatld: chatld, chatHistory: chatHistory });
  } catch (error) {
    console.error("Error al obtener respuesta de Gemini:", error);
    res.status(500).json({ error: 'Error al obtener respuesta del chatbot.' });
  }
});

//Add a get route for the root path
app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
module.exports = app;