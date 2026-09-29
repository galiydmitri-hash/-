export default function dashboardFunction() {
    const aiBtn = document.querySelector('.ai-btn');
    const topicListBtn = document.querySelector('.topic-list-btn');
    const aiChatWindow = document.querySelector('.ai-chat-window');
    const topicList = document.querySelector('.topic-list');

    if (aiBtn && aiChatWindow && topicList) {
        aiBtn.addEventListener('click', () => {
            aiChatWindow.classList.add('is-active');
            topicList.classList.remove('is-active');
            aiBtn.classList.add('is-focus');
            topicListBtn?.classList.remove('is-focus');
        });
    }

    if (topicListBtn && aiChatWindow && topicList) {
        topicListBtn.addEventListener('click', () => {
            topicList.classList.add('is-active');
            aiChatWindow.classList.remove('is-active');
            topicListBtn.classList.add('is-focus');
            aiBtn?.classList.remove('is-focus');
        });
    }
}