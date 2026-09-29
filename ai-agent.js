import { saveTopicToDatabase, renderTopicItem } from './validation.js';

const inputArea = document.getElementById('aiInput');
const aiMessages = document.getElementById('aiMessages');
const aiBtn = document.getElementById('aiSendBtn');
let isSending = false;

function appendMessage(text, sender = 'bot') {
    if (!aiMessages) return;
    const message = document.createElement('div');
    message.className = `ai-message ${sender}`;
    message.textContent = String(text ?? '');
    aiMessages.appendChild(message);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return message;
}

async function handleSendMessage() {
    if (!inputArea || isSending) return;
    const prompt = inputArea.value.trim();
    if (!prompt) return;

    appendMessage(prompt, 'user');
    inputArea.value = '';
    const loading = appendMessage('Шукаю інформацію…', 'bot');
    isSending = true;
    if (aiBtn) aiBtn.disabled = true;

    try {
        const response = await fetch('/api/ai-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);

        if (data.functionCall?.name === 'create_topic') {
            const { title, main, secondary } = data.functionCall.args || {};
            if (![title, main, secondary].every(value => typeof value === 'string' && value.trim())) {
                throw new Error('AI повернув неповні дані теми.');
            }

            const topic = {
                id: `tab-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
                title: title.trim(), main: main.trim(), secondary: secondary.trim()
            };
            const isFirst = !document.querySelector('.list')?.children.length;
            if (await saveTopicToDatabase(topic)) {
                renderTopicItem(topic, isFirst);
                appendMessage(`Тему «${topic.title}» успішно додано!`);
            } else {
                appendMessage('Не вдалося зберегти тему в базі даних.');
            }
        } else {
            appendMessage(data.text || 'Не вдалося отримати відповідь.');
        }
    } catch (error) {
        appendMessage(error.message || 'Помилка з’єднання із сервером.');
        console.error('AI agent error:', error);
    } finally {
        loading?.remove();
        isSending = false;
        if (aiBtn) aiBtn.disabled = false;
    }
}

export function initAiAgent() {
    if (!aiBtn || !inputArea) return;
    aiBtn.addEventListener('click', handleSendMessage);
    inputArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    });
}
