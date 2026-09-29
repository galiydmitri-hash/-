const inputList = document.querySelector('.inputForList');
const inputMain = document.querySelector('.inputForMain');
const textarea = document.querySelector('.inputForSecondary');
const btn = document.querySelector('.add-new-topic-btn');
const list = document.querySelector('.list');
const topicList = document.querySelector('.topic-list');
const bg = document.querySelector('.bg');
const addNewTopic = document.querySelector('.add-new-topic');

let eventsInitialized = false;

async function getStoredTopics() {
    try {
        const response = await fetch('/api/get-topics');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const topics = await response.json();
        return Array.isArray(topics) ? topics : [];
    } catch (error) {
        console.error('Не вдалося завантажити теми:', error);
        return [];
    }
}

export async function saveTopicToDatabase(topic) {
    try {
        const response = await fetch('/api/add-topic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(topic)
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.error || `HTTP ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('Не вдалося зберегти тему:', error);
        return false;
    }
}

export function renderTopicItem(topic, isFirst = false) {
    if (!list || !topicList || !topic?.id) return;

    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `option-btn${isFirst ? ' is-focus' : ''}`;
    button.dataset.tab = String(topic.id);
    button.textContent = topic.title || 'Без назви';
    item.appendChild(button);

    const card = document.createElement('div');
    card.className = `card tab-content${isFirst ? ' is-active' : ''}`;
    card.dataset.content = String(topic.id);

    const main = document.createElement('div');
    main.className = 'main-info';
    main.textContent = topic.main || '';

    const secondary = document.createElement('div');
    secondary.className = 'secondary-info';
    secondary.textContent = topic.secondary || '';

    card.append(main, secondary);
    list.appendChild(item);
    topicList.appendChild(card);
}

async function loadTopics() {
    if (!list || !topicList) return;
    list.replaceChildren();
    topicList.replaceChildren();
    const topics = await getStoredTopics();
    topics.forEach((topic, index) => renderTopicItem(topic, index === 0));
}

async function handleAddTopic(event) {
    event.preventDefault();
    if (!inputList || !inputMain || !textarea || !btn) return;

    const title = inputList.value.trim();
    const main = inputMain.value.trim();
    const secondary = textarea.value.trim();
    if (!title || !main || !secondary) {
        alert('Заповніть усі поля.');
        return;
    }

    const topic = {
        id: `tab-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
        title, main, secondary
    };

    btn.disabled = true;
    try {
        if (await saveTopicToDatabase(topic)) {
            renderTopicItem(topic, list?.children.length === 0);
            inputList.value = '';
            inputMain.value = '';
            textarea.value = '';
            bg?.classList.remove('is-active');
            addNewTopic?.classList.remove('is-active');
        } else {
            alert('Не вдалося зберегти тему. Перевірте з’єднання та налаштування сервера.');
        }
    } finally {
        btn.disabled = false;
    }
}

function handleTabClick(event) {
    const button = event.target.closest('.option-btn');
    if (!button || !list?.contains(button)) return;
    const tabId = button.dataset.tab;
    list.querySelectorAll('.option-btn').forEach((item) => {
        item.classList.toggle('is-focus', item === button);
    });
    topicList?.querySelectorAll('.tab-content').forEach((card) => {
        card.classList.toggle('is-active', card.dataset.content === tabId);
    });
}

export function createNewElement() {
    if (!eventsInitialized) {
        btn?.addEventListener('click', handleAddTopic);
        list?.addEventListener('click', handleTabClick);
        eventsInitialized = true;
    }
    return loadTopics();
}
