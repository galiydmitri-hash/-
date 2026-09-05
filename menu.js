const listBtn = document.querySelector('.list-btn');
const list = document.querySelector('.list');
const bg = document.querySelector('.bg')
const addNewTopic = document.querySelector('.add-new-topic')
const addBtn = document.querySelector('.add-btn')
const closeBtn = document.querySelector('.close-btn')

function openOrCloseList() {
    list.classList.toggle('is-active');
    listBtn.classList.toggle('is-active');
}

export function List(){
    if (listBtn && list) {
    listBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        openOrCloseList();
    });

    document.addEventListener('click', (event) => {
            if (!list.contains(event.target) && !listBtn.contains(event.target)) {
                list.classList.remove('is-active');
                listBtn.classList.remove('is-active');
            }
        });
    }

    addBtn.addEventListener('click', () => {
        bg.classList.add('is-active')
        addNewTopic.classList.add('is-active')
    })

    closeBtn.addEventListener('click', () => {
        bg.classList.remove('is-active')
        addNewTopic.classList.remove('is-active')
    })
}