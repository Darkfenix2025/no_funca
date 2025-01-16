document.addEventListener('DOMContentLoaded', function() {
    let chatHistory = [];
    let chatId = null;
    const closeChatbotButton = document.getElementById('close-chatbot-button')
      const chatLog = document.getElementById('chat-log');
       const userInput = document.getElementById('user-input');
       const sendButton = document.getElementById('send-button');
   if(closeChatbotButton){
      closeChatbotButton.addEventListener('click', ()=>{
      window.location.href = "https://www.legalito.ar"; // Reemplaza "index.html" con la URL de tu página principal
   });
   }
      if(sendButton){
            sendButton.addEventListener('click', async function() {
            const userMessage = userInput.value.trim();
            if (!userMessage) return;
            chatLog.innerHTML += `<p class="user-message">${userMessage}</p>`;
            userInput.value = '';
         try {
               const response = await fetch('/api/chat', {
                  method: 'POST',
                  headers: {
                     'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ userMessage: userMessage, chatId: chatId, chatHistory: chatHistory }),
               });
                  const data = await response.json();
                     chatId = data.chatId;
                     chatHistory = data.chatHistory;
                     chatLog.innerHTML += `<p class="chatbot-message">${data.response}</p>`;
                     chatLog.scrollTop = chatLog.scrollHeight;
               } catch (error) {
                  console.error("Error al obtener respuesta del chatbot:", error);
                  chatLog.innerHTML += `<p class="chatbot-message">Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde.</p>`;
               }
            });
   }
});