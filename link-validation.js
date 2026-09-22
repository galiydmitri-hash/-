const shortInfo = document.querySelector('.short-info')
const inputForLink = document.querySelector('.inputForLink')
const addNewLinkBtn = document.querySelector('.add-new-link-btn')

let links = JSON.parse(localStorage.getItem('savedLinks')) || []

function createLinkElement(url, index) {
    const item = document.createElement('div')
    item.setAttribute('class', 'link-container')
    item.innerHTML = `
        <div class="icon">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/>
            <path d="M3.3 12H20.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <path d="M4.2 8.2C6.3 9.1 8.9 9.6 12 9.6C15.1 9.6 17.7 9.1 19.8 8.2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M4.2 15.8C6.3 14.9 8.9 14.4 12 14.4C15.1 14.4 17.7 14.9 19.8 15.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M12 3C9.5 5.2 8.1 8.4 8.1 12C8.1 15.6 9.5 18.8 12 21" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <path d="M12 3C14.5 5.2 15.9 8.4 15.9 12C15.9 15.6 14.5 18.8 12 21" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        </div> 
        <p class="title">Урок: ${index + 1}</p>
        <a href="${url}" target="_blank"><button class="link-btn">Перейти</button></a>
    `
    return item
}

export function addLink() {
    links.forEach((url, index) => {
        const item = createLinkElement(url, index)
        shortInfo.appendChild(item)
    })

    addNewLinkBtn.addEventListener('click', () => {
        const inputValue = inputForLink.value.trim()

        if (!inputValue) return 

        links.push(inputValue)
        localStorage.setItem('savedLinks', JSON.stringify(links))

        const item = createLinkElement(inputValue, links.length - 1)
        shortInfo.appendChild(item)
        
        inputForLink.value = ''
    })
}

export default addLink
