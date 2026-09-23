const searchArea = document.querySelector('.search-area')
const topicList = document.querySelector('.topic-list')

const cardsArray = Array.from(topicList.children)

function findNearstCard(mainText, secondaryText, value, card){
    const searchVal = value.toLowerCase();
    const mainContent = mainText.textContent.toLowerCase();
    const secondaryContent = secondaryText.textContent.toLowerCase();

    if (mainContent.includes(searchVal) || secondaryContent.includes(searchVal)) {
        card.style.display = 'flex'
    } else {
        card.style.display = 'none'
    }
}

export function inputEvent(){
    searchArea.addEventListener('input', () => {
        const query = searchArea.value.trim();

        cardsArray.forEach((card) => {
            const mainInfo = card.querySelector('.main-info')
            const secondaryInfo = card.querySelector('.secondary-info')

            if (!mainInfo || !secondaryInfo) return

            findNearstCard(mainInfo, secondaryInfo, query, card)
        });
    })
}

export default inputEvent