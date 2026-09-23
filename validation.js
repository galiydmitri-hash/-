const inputList = document.querySelector('.inputForList');
const inputMain = document.querySelector('.inputForMain');
const textarea = document.querySelector('.inputForSecondary'); 
const btn = document.querySelector('.add-new-topic-btn');
const list = document.querySelector('.list');
const topicList = document.querySelector('.topic-list');
const bg = document.querySelector('.bg');
const addNewTopic = document.querySelector('.add-new-topic');
const searchInput = document.querySelector('.search-input'); // <-- ВАШ ИНПУТ ДЛЯ ПОИСКА

let isEventsInitialized = false;

async function getStoredTopics() {
    try {
        const response = await fetch('/api/get-topics');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (e) {
        console.error('Failed to fetch topics from Database:', e);
        return [];
    }
}

async function saveTopicToDatabase(newTopic) {
    try {
        const response = await fetch('/api/add-topic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTopic)
        });
        if (!response.ok) throw new Error('Failed to save');
        return true;
    } catch (e) {
        console.error('Failed to save topic to Database:', e);
        return false;
    }
}

function renderTopicItem(topic, isFirst) {
    const option = document.createElement('li');
    const optionBtn = document.createElement('button');
    optionBtn.className = `option-btn ${isFirst ? 'is-focus' : ''}`;
    optionBtn.dataset.tab = topic.id;
    optionBtn.textContent = topic.title;
    option.appendChild(optionBtn);

    const card = document.createElement('div');
    card.className = `card tab-content ${isFirst ? 'is-active' : ''}`;
    card.dataset.content = topic.id;

    const mainSection = document.createElement('div');
    mainSection.className = 'main-info';
    mainSection.textContent = topic.main;

    const secondarySection = document.createElement('div');
    secondarySection.className = 'secondary-info';
    secondarySection.textContent = topic.secondary;

    card.appendChild(mainSection);
    card.appendChild(secondarySection);

    list.appendChild(option);
    topicList.appendChild(card);
}

async function loadTopics() {
    list.innerHTML = '';
    topicList.innerHTML = '';
    const topics = await getStoredTopics(); 
    topics.forEach((topic, index) => renderTopicItem(topic, index === 0));
    
    // Если пользователь уже что-то ввел в поиск до загрузки, сразу фильтруем
    if (searchInput && searchInput.value.trim() !== '') {
        filterTopics(searchInput.value);
    }
}

async function handleAddTopic(event) {
    event.preventDefault();

    const inputListValue = inputList.value.trim();
    const inputMainValue = inputMain.value.trim();
    const textareaValue = textarea.value.trim();

    if (!inputListValue || !inputMainValue || !textareaValue) return;

    const newTopic = {
        id: `tab-${Date.now()}`,
        title: inputListValue,
        main: inputMainValue,
        secondary: textareaValue
    };

    btn.disabled = true;
    const isSaved = await saveTopicToDatabase(newTopic);

    if (isSaved) {
        const isFirst = list.children.length === 0;
        renderTopicItem(newTopic, isFirst);

        inputList.value = '';
        inputMain.value = '';
        textarea.value = '';

        bg.classList.remove('is-active');
        addNewTopic.classList.remove('is-active');

        // Сбрасываем поиск при добавлении нового элемента, чтобы пользователь его увидел
        if (searchInput) {
            searchInput.value = '';
            filterTopics('');
        }
    } else {
        alert('Не удалось сохранить данные на сервер.');
    }
    btn.disabled = false;
}

function handleTabClick(event) {
    const targetBtn = event.target.closest('.option-btn');
    if (!targetBtn) return;

    const tabId = targetBtn.dataset.tab;

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.toggle('is-focus', btn === targetBtn);
    });

    document.querySelectorAll('.tab-content').forEach(card => {
        card.classList.toggle('is-active', card.dataset.content === tabId);
    });
}

// Выделенная функция для фильтрации элементов
function filterTopics(queryText) {
    const query = queryText.toLowerCase().trim();

    // 1. Фильтруем кнопки в списке слева (по названию темы)
    document.querySelectorAll('.option-btn').forEach(btn => {
        const text = btn.textContent.toLowerCase();
        const parentLi = btn.closest('li');
        if (parentLi) {
            parentLi.style.display = text.includes(query) ? '' : 'none';
        }
    });

    // 2. Фильтруем сами карточки справа (по главному тексту и описанию)
    document.querySelectorAll('.tab-content').forEach(card => {
        const mainText = card.querySelector('.main-info').textContent.toLowerCase();
        const secText = card.querySelector('.secondary-info').textContent.toLowerCase();
        
        if (mainText.includes(query) || secText.includes(query)) {
            // Если карточка подходит и должна быть активной в данный момент, возвращаем её отображение
            card.style.display = ''; 
        } else {
            card.style.display = 'none';
        }
    });
}

// Главная функция инициализации модуля
export function createNewElement() {
    loadTopics();
    
    if (!isEventsInitialized) {
        btn.addEventListener('click', handleAddTopic);
        list.addEventListener('click', handleTabClick);
        
        // Навешиваем событие живого поиска
        if (searchInput) {
            searchInput.addEventListener('input', (e) => filterTopics(e.target.value));
        }
        
        isEventsInitialized = true;
    }
}
