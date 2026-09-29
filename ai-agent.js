import { saveTopicToDatabase, renderTopicItem } from './validation.js';

const inputArea = document.getElementById('aiInput');
const aiMessages = document.getElementById('aiMessages'); 
const aiBtn = document.getElementById('aiSendBtn');

function appendMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('ai-message', sender);
    message.textContent = text;
    aiMessages.appendChild(message);

    aiMessages.scrollTop = aiMessages.scrollHeight;
}

async function handleSendMessage() {
    const inputValue = inputArea.value.trim();
    if (!inputValue) return; 

    appendMessage(inputValue, 'user');
    inputArea.value = '';

    const loadingMessage = document.createElement('div');
    loadingMessage.classList.add('ai-message', 'bot');
    loadingMessage.textContent = 'Шукаю інформацію...';
    aiMessages.appendChild(loadingMessage);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    try {
        const response = await fetch('/api/ai-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: inputValue })
        });

        const data = await response.json();
        loadingMessage.remove();

        if (data.functionCall && data.functionCall.name === 'create_topic') {
            const { title, main, secondary } = data.functionCall.args;

            const newTopic = {
                id: `tab-${Date.now()}`,
                title,
                main,
                secondary
            };

            // Проверяем, первая ли это карточка в списке
            const listContainer = document.querySelector('.list');
            const isFirst = listContainer && listContainer.children.length === 0;

            const isSaved = await saveTopicToDatabase(newTopic);
            if (isSaved) {
                renderTopicItem(newTopic, isFirst);
                appendMessage(`Тему "${title}" успішно додано!`, 'bot');
            } else {
                appendMessage('Помилка при збереженні теми в базу.', 'bot');
            }
        } else {
            appendMessage(data.text || 'Не вдалося отримати відповідь.', 'bot');
        }

    } catch (error) {
        loadingMessage?.remove();
        appendMessage('Помилка з’єднання з сервером.', 'bot');
        console.error(error);
    }
}

export function initAiAgent() {
    if (!aiBtn || !inputArea) return;

    aiBtn.addEventListener('click', handleSendMessage);
    inputArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    });
}