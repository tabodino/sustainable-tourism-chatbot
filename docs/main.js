const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
    messageDiv.innerHTML = message.replace(/\n/g, '<br>');
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.textContent = 'Claude réfléchit';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
        loading.remove();
    }
}

async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    // Display user message
    addMessage(question, true);
    userInput.value = '';
    sendButton.disabled = true;

    addLoading();

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question })
        });

        removeLoading();

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        const body = JSON.parse(data.body);
        
        addMessage(body.llm_answer || 'Erreur: Pas de réponse reçue');

        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-badge';
        infoDiv.textContent = `📊 ${body.destinations_count} destinations analysées`;
        chatMessages.appendChild(infoDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        removeLoading();
        addMessage('<strong>Erreur:</strong> Impossible de contacter le serveur. Vérifiez votre connexion et l\'URL de l\'API.', false);
        console.error('Erreur:', error);
    }

    sendButton.disabled = false;
    userInput.focus();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

window.onload = () => {
    userInput.focus();
};