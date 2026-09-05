const inputList = document.querySelector('.inputForList')
const inputMain = document.querySelector('.inputForMain')
const textarea = document.querySelector('.inputForSecondary') 
const btn = document.querySelector('.add-new-topic-btn')
const list = document.querySelector('.list')
const topicList = document.querySelector('.topic-list')
const bg = document.querySelector('.bg')
const addNewTopic = document.querySelector('.add-new-topic')

// Загружает данные с сервера Vercel из базы данных
async function getStoredTopics() {
    try {
        const response = await fetch('/api/get-topics')
        if (!response.ok) throw new Error('Network response was not ok')
        return await response.json()
    } catch (e) {
        console.error('Failed to fetch topics from Database:', e)
        return []
    }
}

// Отправляет новую тему в базу данных Neon
async function saveTopicToDatabase(newTopic) {
    try {
        const response = await fetch('/api/add-topic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTopic)
        })
        if (!response.ok) throw new Error('Failed to save')
        return true
    } catch (e) {
        console.error('Failed to save topic to Database:', e)
        return false
    }
}

function renderTopicItem(topic, isFirst) {
    const option = document.createElement('li')
    const optionBtn = document.createElement('button')
    optionBtn.className = `option-btn ${isFirst ? 'is-focus' : ''}`
    optionBtn.dataset.tab = topic.id
    optionBtn.textContent = topic.title
    option.appendChild(optionBtn)

    const card = document.createElement('div')
    card.className = `card tab-content ${isFirst ? 'is-active' : ''}`
    card.dataset.content = topic.id

    const mainSection = document.createElement('div')
    mainSection.className = 'main-info'
    mainSection.textContent = topic.main

    const secondarySection = document.createElement('div')
    secondarySection.className = 'secondary-info'
    secondarySection.textContent = topic.secondary

    card.appendChild(mainSection)
    card.appendChild(secondarySection)

    list.appendChild(option)
    topicList.appendChild(card)
}

// Делаем функцию асинхронной, так как ждем данные из БД
async function loadTopics() {
    list.innerHTML = ''
    topicList.innerHTML = ''
    const topics = await getStoredTopics() // Ждем загрузки
    topics.forEach((topic, index) => renderTopicItem(topic, index === 0))
}

// Функция добавления тоже становится асинхронной
async function handleAddTopic() {
    const inputListValue = inputList.value.trim()
    const inputMainValue = inputMain.value.trim()
    const textareaValue = textarea.value.trim()

    if (!inputListValue || !inputMainValue || !textareaValue) return

    const newTopic = {
        id: `tab-${Date.now()}`,
        title: inputListValue,
        main: inputMainValue,
        secondary: textareaValue
    }

    // Блокируем кнопку на время отправки, чтобы пользователь не спамил кликами
    btn.disabled = true;

    // Сохраняем в базу данных Neon
    const isSaved = await saveTopicToDatabase(newTopic)

    if (isSaved) {
        // Если успешно сохранилось в БД, определяем, первая ли это вкладка
        const currentTopics = await getStoredTopics()
        const isFirst = currentTopics.length === 1 || list.children.length === 0
        
        renderTopicItem(newTopic, isFirst)

        inputList.value = ''
        inputMain.value = ''
        textarea.value = ''

        bg.classList.remove('is-active')
        addNewTopic.classList.remove('is-active')
    } else {
        alert('Не удалось сохранить данные на сервер. Попробуйте еще раз.');
    }

    btn.disabled = false;
}

function handleTabClick(event) {
    const targetBtn = event.target.closest('.option-btn')
    if (!targetBtn) return

    const tabId = targetBtn.dataset.tab

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.toggle('is-focus', btn === targetBtn)
    })

    document.querySelectorAll('.tab-content').forEach(card => {
        card.classList.toggle('is-active', card.dataset.content === tabId)
    })
}

export function createNewElement() {
    loadTopics()
    
    btn.removeEventListener('click', handleAddTopic)
    list.removeEventListener('click', handleTabClick)
    
    btn.addEventListener('click', handleAddTopic)
    list.addEventListener('click', handleTabClick)
}
