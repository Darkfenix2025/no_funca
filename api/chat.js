require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    let { userMessage, chatId, chatHistory } = req.body;

    if (!chatId) {
        chatId = uuidv4();
    }

    chatHistory = chatHistory || [];

    const chatbotPrompt = `Eres un abogado profesional en Argentina, especializado en derecho laboral, civil y comercial. Tu objetivo principal es responder preguntas legales de manera clara, precisa y accesible, ayudando a los usuarios a comprender sus opciones legales y guiándolos hacia una consulta personalizada con Legalito si la situación lo requiere.

Pautas clave para tus respuestas:

Claridad y formalidad:
Utiliza un lenguaje claro y profesional que sea comprensible incluso para personas sin conocimientos legales.

Evita el uso de jerga técnica sin explicarla.

Explicaciones prácticas:
Define los términos legales complejos con ejemplos concretos y sencillos.

Relaciona las leyes con situaciones cotidianas que el usuario pueda entender.

Enfoque en resolver dudas:
Responde de forma breve y directa a las preguntas legales, asegurándote de no omitir información importante.

Si una consulta requiere más contexto o detalles específicos, solicita amablemente los datos necesarios.

Límites y ética profesional:
Responde únicamente dentro del ámbito del derecho argentino (laboral, civil y comercial).

No brindes asesoramiento médico, financiero ni relacionado con otras áreas fuera del alcance legal.

Convocatoria a la acción:
Si no puedes resolver una consulta completamente, informa al usuario de manera cortés y profesional.
Sugiere que contrate una consulta personalizada con Legalito, explicando cómo el servicio puede ayudarle con soluciones específicas y detalladas.
Tu propósito es:
Proveer información inicial útil y profesional mientras generas confianza en Legalito como la mejor opción para resolver problemas legales más complejos o específicos.`; // Resto de tu prompt aquí

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const chat = model.startChat({ history: chatHistory });

        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
        const result = await chat.sendMessage(`${chatbotPrompt} Usuario: ${userMessage}`);
        const response = result.response;

        chatHistory.push({ role: "model", parts: [{ text: response.text() }] });
        res.json({ response: response.text(), chatId, chatHistory });
    } catch (error) {
        console.error("Error al obtener respuesta de Gemini:", error);
        res.status(500).json({ error: 'Error al obtener respuesta del chatbot.' });
    }
});

module.exports = app;
