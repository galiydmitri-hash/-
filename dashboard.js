export default function dashboardFunction() {
    const dashboardBtn = document.querySelector('.dashboard-btn');
    const dashboard = document.querySelector('.dashboard');
    const aiBtn = document.querySelector('.ai-btn');
    const topicListBtn = document.querySelector('.topic-list-btn');
    const aiChatWindow = document.querySelector('.ai-chat-window');
    const topicList = document.querySelector('.topic-list');

    // 1. Открытие / закрытие боковой панели дашборда
    if (dashboardBtn && dashboard) {
        dashboardBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dashboard.classList.toggle('is-active');
        });

        // Закрываем дашборд при клике вне его области
        document.addEventListener('click', (e) => {
            if (!dashboard.contains(e.target) && !dashboardBtn.contains(e.target)) {
                dashboard.classList.remove('is-active');
            }
        });
    }

    // 2. Переключение на AI-чат
    if (aiBtn && aiChatWindow && topicList) {
        aiBtn.addEventListener('click', () => {
            aiChatWindow.classList.add('is-active');
            topicList.classList.remove('is-active');
            aiBtn.classList.add('is-focus');
            topicListBtn?.classList.remove('is-focus');
        });
    }

    // 3. Переключение на список тем
    if (topicListBtn && aiChatWindow && topicList) {
        topicListBtn.addEventListener('click', () => {
            topicList.classList.add('is-active');
            aiChatWindow.classList.remove('is-active');
            topicListBtn.classList.add('is-focus');
            aiBtn?.classList.remove('is-focus');
        });
    }
}