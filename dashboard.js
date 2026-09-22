const dashboard = document.querySelector('.dashboard')
const dashboardBtn = document.querySelector('.dashboard-btn')
const topicListBtn = document.querySelector('.topic-list-btn')
const shortInfoBtn = document.querySelector('.short-info-btn')
const btn = document.querySelectorAll('.btn')
const shortInfo = document.querySelector('.short-info')
const topicList = document.querySelector('.topic-list')
const secondaryContainer = document.querySelector('.secondary-container')
const listBtn = document.querySelector('.list-btn');

const childrenArray = Array.from(secondaryContainer.children);

export function dashboardFunction(){
    topicList.classList.add('is-active')
    topicListBtn.classList.add('is-focus')

    dashboardBtn.addEventListener('click', (event) => {
        event.stopPropagation(); 
        dashboard.classList.toggle('is-active');
    });

    document.body.addEventListener('click', (event) => {
        if (!dashboard.contains(event.target) && event.target !== dashboardBtn && dashboard.classList.contains('is-active')) {
            dashboard.classList.remove('is-active');
        }
    });

    topicListBtn.addEventListener('click', () => {
        listBtn.style.display = "flex"
        childrenArray.forEach(el => el.classList.remove('is-active'));
        topicList.classList.add('is-active')
        btn.forEach((el) => {
            el.classList.remove('is-focus')
            if (el.classList.contains('topic-list-btn')){
                el.classList.add('is-focus')
            } else{
                return
            }
        })
    })

    shortInfoBtn.addEventListener('click', () => {
        listBtn.style.display = "none"
        childrenArray.forEach(el => el.classList.remove('is-active'));
        shortInfo.classList.add('is-active')
        btn.forEach((el) => {
            el.classList.remove('is-focus')
            if (el.classList.contains('short-info-btn')){
                el.classList.add('is-focus')
            } else{
                return
            }
        })
    })
}

export default dashboardFunction