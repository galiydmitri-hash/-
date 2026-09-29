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

    // 2. Добавляем временное сообщение ожидания от бота
    const loadingMessage = document.createElement('div');
    loadingMessage.classList.add('ai-message', 'bot');
    loadingMessage.textContent = 'Шукаю інформацію...';
    aiMessages.appendChild(loadingMessage);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    try {
        // 3. Запрос на сервер
        const response = await fetch('/api/ai-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: inputValue })
        });

        const data = await response.json();
        
        // Удаляем индикатор загрузки
        loadingMessage.remove();

        // 4. Проверяем ответ от ИИ
        if (data.functionCall && data.functionCall.name === 'create_topic') {
            const { title, main, secondary } = data.functionCall.args;

            const newTopic = {
                id: `tab-${Date.now()}`,
                title,
                main,
                secondary
            };

            // Сохраняем в базу и рендерим
            const isSaved = await saveTopicToDatabase(newTopic);
            if (isSaved) {
                renderTopicItem(newTopic, false);
                appendMessage(`Тему "${title}" успішно додано!`, 'bot');
            } else {
                appendMessage('Помилка при збереженні теми в базу.', 'bot');
            }
        } else {
            // Если ИИ вернул обычный текст
            appendMessage(data.text || 'Не вдалося отримати відповідь.', 'bot');
        }

    } catch (error) {
        loadingMessage.remove();
        appendMessage('Помилка з’єднання з сервером.', 'bot');
        console.error(error);
    }
}

aiBtn.addEventListener('click', handleSendMessage);

inputArea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});