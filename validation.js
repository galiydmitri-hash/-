const inputList = document.querySelector('.inputForList')
const inputMain = document.querySelector('.inputForMain')
const textarea = document.querySelector('.inputForSecondary') 
const btn = document.querySelector('.add-new-topic-btn')
const list = document.querySelector('.list')
const topicList = document.querySelector('.topic-list')
const bg = document.querySelector('.bg')
const addNewTopic = document.querySelector('.add-new-topic')

const STORAGE_KEY = 'topics_data'

function getStoredTopics() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch (e) {
        console.error('Failed to parse topics from localStorage:', e)
        return []
    }
}

function saveTopics(topics) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics))
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

    // FIX: Append the <li> wrapper containing optionBtn to the list
    list.appendChild(option)
    topicList.appendChild(card)
}

function loadTopics() {
    list.innerHTML = ''
    topicList.innerHTML = ''
    const topics = getStoredTopics()
    topics.forEach((topic, index) => renderTopicItem(topic, index === 0))
}

function handleAddTopic() {
    const inputListValue = inputList.value.trim()
    const inputMainValue = inputMain.value.trim()
    const textareaValue = textarea.value.trim()

    if (!inputListValue || !inputMainValue || !textareaValue) return

    const topics = getStoredTopics()
    const newTopic = {
        id: `tab-${Date.now()}`,
        title: inputListValue,
        main: inputMainValue,
        secondary: textareaValue
    }

    topics.push(newTopic)
    saveTopics(topics)

    const isFirst = topics.length === 1
    renderTopicItem(newTopic, isFirst)

    inputList.value = ''
    inputMain.value = ''
    textarea.value = ''

    bg.classList.remove('is-active')
    addNewTopic.classList.remove('is-active')
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
    
    // Prevent multiple redundant event listeners
    btn.removeEventListener('click', handleAddTopic)
    list.removeEventListener('click', handleTabClick)
    
    btn.addEventListener('click', handleAddTopic)
    list.addEventListener('click', handleTabClick)
}