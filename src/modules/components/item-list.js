import { global } from "../../scripts/global-variables.js"
import { stockManager } from "../../scripts/stock-manager.js"
import { ItemModal } from "./item-modal.js"

const display = ({ search = '', order = 'name' }) => {
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
                <span> ${name} </span>
                <span> ${quantity} un. </span> 
                <div class='item-operations' data-id='${id}'> 
                    <input type='number' />
                    <button class='apply'> <i class="fa-solid fa-check"></i> </button>
                    <button class='edit'> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>
            `)
        }).join('')

        if (categoryItems.length == 0) {return}
        return(`
            <div class='category'>
                <h2> ${category} <i class="fa-solid fa-angle-up"></i> </h2>

                <div class='category-items'>
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

const setup = () => {
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
        const operationInput = o.querySelector('input')
        const applyButton = o.querySelector('.apply')
        const editButton = o.querySelector('.edit')
        const itemId = o.dataset.id

        editButton.addEventListener('click', () => {
            global.get('render/modal-display').state = { page: ItemModal, props: {edit: true, id: itemId} }
        })
    })

}



const style = undefined

export const ItemList = {
    display: display,
    setup: setup,
    style: style
}

