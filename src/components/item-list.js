import { global, render } from "../../renderer.js"
import { stockManager } from "../../stock-manager.js"
import { ItemModal } from "./item-modal.js"

const display = ({search, order}) => {
    global.get('alerts').value = stockManager.alerts()
    const stock = stockManager.get()
    const operations = global.get('operations')

    //alphabetical categs by default
    stock.sort((a, b) => a.category.localeCompare(b.category, undefined, {numeric: true}))

    if (order == 'name') {stock.forEach(element => element.items.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true})))}

    if (order == 'least') {stock.forEach(element => element.items.sort((a, b) => a.quantity - b.quantity))}

    if (order == 'most') {stock.forEach(element => element.items.sort((a, b) => b.quantity - a.quantity))}

    const listContent = stock.map(({category, items}) => {
        const categoryItems = items.map(item => {
            const lName = item.name.toLowerCase()
            const lSearch = search.toLowerCase()
            if (!lName.includes(lSearch)) {return}

            return(`
                <span class='item-name'> ${item.name} </span>
                <span class='item-quantity'> ${item.quantity} </span>
                <div id='${item.id}' class='item-operation'>
                    <input type='text' class='input-operation' placeholder='0' value='${operations.get(item.id) || ''}' />
                    <button class='apply-operation'> Aplicar </button>
                    <button class='edit-item'> Editar </button>
                </div>
            `)
        }).join('')

        if (categoryItems.length == 0) {return}
        return(`
            <div class='category'>
                <h2> ${category == 'undefined' ? 'Itens' : category} </h2>
                <div class='items'>
                    <span> Nome </span>
                    <span> Qtd. </span>
                    <span> Operação </span>

                    ${categoryItems}
                </div>
            </div>
        `)
    }).join('')

    return(listContent)
}

const setup = (props) => {
    const operations = global.get('operations')
    const root = document.querySelector('.item-list')
    const modalDisplay = document.querySelector('.modal-display')

    const itemOperationDivs = document.querySelectorAll('.item-operation')
    itemOperationDivs.forEach(div => {
        const operationInput = div.querySelector('.input-operation')
        const applyOperationButton = div.querySelector('.apply-operation')
        const editItemButton = div.querySelector('.edit-item')
        const item = stockManager.items.get(div.id)

        editItemButton.addEventListener('click', () => {
            render(ItemModal, modalDisplay, {type: 'edit', data: item})
        })

        let previousValue = 0

        operationInput.addEventListener('input', () => {
            const inputRules = /^[-+]?\d*$/
            const allowed = inputRules.test(operationInput.value)
            
            if (allowed) {
                const floor = item.quantity * (-1)
                if (operationInput.value < floor) {operationInput.value = floor}
                previousValue = operationInput.value
            }
            else {operationInput.value = previousValue}

            const value = Number(operationInput.value) || 0
            operations.set(item.id, value)
            global.get('render/itemOperations').update()
        })

        applyOperationButton.addEventListener('click', () => {
            operations.apply(item.id)
            global.get('render/itemOperations').update()
            global.get('render/itemList').update()
        })
    })
}

const style = undefined

export const ItemList = {
    display: display,
    setup: setup,
    style: style
}

