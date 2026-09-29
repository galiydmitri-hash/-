const dashboard = document.querySelector('.dashboard');
const dashboardBtn = document.querySelector('.dashboard-btn');
const topicListBtn = document.querySelector('.topic-list-btn');
const aiBtn = document.querySelector('.ai-btn'); // Переименовали для понятности
const btn = document.querySelectorAll('.btn');
const aiChatWindow = document.querySelector('.ai-chat-window');
const topicList = document.querySelector('.topic-list');
const secondaryContainer = document.querySelector('.secondary-container');
const listBtn = document.querySelector('.list-btn');

const childrenArray = Array.from(secondaryContainer.children);

export function dashboardFunction() {
    // Стартовое состояние
    topicList.classList.add('is-active');
    topicListBtn.classList.add('is-focus');

    // Открытие/закрытие боковой панели (Дашборда)
    dashboardBtn.addEventListener('click', (event) => {
        event.stopPropagation(); 
        dashboard.classList.toggle('is-active');
    });

    // Клик снаружи дашборда — закрываем его
    document.body.addEventListener('click', (event) => {
        if (!dashboard.contains(event.target) && event.target !== dashboardBtn && dashboard.classList.contains('is-active')) {
            dashboard.classList.remove('is-active');
        }
    });

    // Переключение на список тем (Home)
    topicListBtn.addEventListener('click', () => {
        listBtn.style.display = "flex";
        childrenArray.forEach(el => el.classList.remove('is-active'));
        topicList.classList.add('is-active');

        btn.forEach((el) => {
            el.classList.remove('is-focus');
            if (el.classList.contains('topic-list-btn')) {
                el.classList.add('is-focus');
            }
        });
    });

    // Переключение на AI Чат
    aiBtn.addEventListener('click', () => {
        listBtn.style.display = "none";
        childrenArray.forEach(el => el.classList.remove('is-active'));
        aiChatWindow.classList.add('is-active');

        btn.forEach((el) => {
            el.classList.remove('is-focus');
            // ИСПРАВЛЕНО: проверяем класс 'ai-btn' вместо 'short-info-btn'
            if (el.classList.contains('ai-btn')) { 
                el.classList.add('is-focus');
            }
        });
    });
}

export default dashboardFunction;