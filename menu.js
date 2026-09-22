const listBtn = document.querySelector('.list-btn');
const list = document.querySelector('.list');
const bg = document.querySelector('.bg');
const addNewTopic = document.querySelector('.add-new-topic');
const addBtn = document.querySelector('.add-btn');
const closeBtn = document.querySelectorAll('.close-btn');
const shortInfo = document.querySelector('.short-info');
const addNewLink = document.querySelector('.add-new-link');

function openOrCloseList() {
    list.classList.toggle('is-active');
    listBtn.classList.toggle('is-active');
}

export function List() {
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

    if (addBtn && bg) {
        addBtn.addEventListener('click', () => {
            bg.classList.add('is-active');

            if (shortInfo && shortInfo.classList.contains('is-active')) {
                if (addNewLink) addNewLink.classList.add('is-active');
            } else {
                if (addNewTopic) addNewTopic.classList.add('is-active');
            }
        });
    }

    if (closeBtn && bg) {
        closeBtn.forEach((btn) => {
            btn.addEventListener('click', () => {
                    bg.classList.remove('is-active');
                    if (addNewLink?.classList.contains('is-active')) addNewLink.classList.remove('is-active');
                    if (addNewTopic?.classList.contains('is-active')) addNewTopic.classList.remove('is-active');
                });
            })
        }
    }