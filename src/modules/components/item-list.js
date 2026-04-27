import { global } from "../../scripts/global-variables.js"
import { i18n } from "../../scripts/i18n.js"
import { stockManager } from "../../scripts/stock-manager.js"
import { ItemModal } from "./item-modal.js"

const display = ({ search = '', order = 'name', operationManager }) => {
    const stock = stockManager.read()

    //Ordering categories alphabetically
    stock.sort((a, b) => a.category.localeCompare(b.category, undefined, {numeric: true}))

    //Ordering items
    if (order == 'name') {stock.forEach(category => category.items.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})))}
    if (order == 'least') {stock.forEach(category => category.items.sort((a, b) => a.quantity - b.quantity))}
    if (order == 'most') {stock.forEach(category => category.items.sort((a, b) => b.quantity - a.quantity))}

    const listContent = stock.map(({ category, items }) => {
        const categoryItems = items.map(({id, name, quantity}) => {
            const lowerName = name.toLowerCase()
            const lowerSearch = search.toLowerCase()
            if (!lowerName.includes(lowerSearch)) {return}

            return(`
                <span class='item-name' title='${name}'> ${name} </span>
                <span class='item-quantity'> ${quantity} un. </span> 
                <div class='item-operations' data-id='${id}'> 
                    <input type='number' value='${operationManager?.get(id)}' placeholder='0' />
                    <button class='apply'> <i class="fa-solid fa-check"></i> </button>
                    <button class='edit'> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>
            `)
        }).join('')

        if (categoryItems.length == 0) {return}
        return(`
            <div class='category'>
                <h2>  
                    <span> ${category} </span> 
                    <i class="fa-solid fa-angle-up"></i> 
                </h2>

                <div class='category-items'>
                    <span> ${i18n.t('name')} </span>
                    <span> ${i18n.t('qtt')} </span>
                    <span> ${i18n.t('operation')} </span>

                    ${categoryItems}
                </div>
            </div>
        `)
    }).join('')

    return(listContent)
}

const setup = ({ operationManager }) => {
    const root = document.querySelector('.tab-display')
    const categories = root.querySelectorAll('.category')
    const itemOperations = root.querySelectorAll('.item-operations')

    categories.forEach(c => {
        const header = c.querySelector('h2')
        const items = c.querySelector('.category-items')

        header.addEventListener('click', () => {
            items.style.display = (items.style.display == 'none' ? 'grid' : 'none')
            header.querySelector('i').classList.toggle('fa-angle-up')
            header.querySelector('i').classList.toggle('fa-angle-down')
        })
    })

    itemOperations.forEach(o => {
        const { itemManager } = stockManager
        const operationInput = o.querySelector('input')
        const applyButton = o.querySelector('.apply')
        const editButton = o.querySelector('.edit')
        const item = itemManager.read(o.dataset.id)
        let prev = 0

        operationInput.addEventListener('input', () => {
            const inputRules = /^[-+]?\d*$/
            const allowed = inputRules.test(operationInput.value)

            if (allowed) {
                const floor = item.quantity * (-1)
                if (operationInput.value < floor) {operationInput.value = floor}
                prev = operationInput.value
            } else {operationInput.value = prev}

            const operation = Number(operationInput.value) || 0
            operationManager.set(item.id, operation)
            global.get('render/operations-tab').reload()
        })

        applyButton.addEventListener('click', () => {
            operationManager.apply(item.id)
            global.get('render/item-list').reload()
            global.get('render/operations-tab').reload()
            global.get('render/alerts-display').reload()
        })

        editButton.addEventListener('click', () => {
            global.get('render/modal-display').state = { page: ItemModal, props: {edit: true, id: item.id} }
        })
    })

}



const style = undefined

export const ItemList = {
    display: display,
    setup: setup,
    style: style
}

