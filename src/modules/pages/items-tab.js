import { global } from "../../scripts/global-variables.js"
import { render } from "../../scripts/renderer.js"
import { stateCallback } from "../../scripts/state-callback.js"
import { ItemModal } from "../components/item-modal.js"
import { ItemList } from "../components/item-list.js"
import { ItemOperations } from "../components/item-operations.js"
import { stockManager } from "../../scripts/stock-manager.js"

const display = () => {

    return(` 
        <div class='items-tab'>
            <div class='flex-row'>
                <div class='search-bar-wrapper'>
                    <input type='text' class='search-bar' placeholder='Buscar um item...' />
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <button class='add-item'> Adicionar item </button>
            </div>
        
            <div class='flex-row order-row'>
                <label for='order-selector'> Ordenar: </label>
                <select class='order-selector'>
                    <option value='name'> Nome </option>
                    <option value='least'> Menor qtd. </option>
                    <option value='most'> Maior qtd. </option>
                </select>
            </div>

            <div class='separator-line'></div>
            <div class='item-list'></div>
        </div>

        <div class='operations-tab'></div>
    `)
}

const setup = () => {
    const root = document.querySelector('.tab-display')
    const itemListDiv = root.querySelector('.item-list')
    const itemOperationsDiv = root.querySelector('.operations-tab')

    const addItemButton = root.querySelector('.add-item')
    const searchBar = root.querySelector('.search-bar')
    const orderSelector = root.querySelector('.order-selector')
    
    //Setup add button
    addItemButton.addEventListener('click', () => {
        global.get('render/modal-display').state = { page: ItemModal }
    })

    //Setup item list & handle search and order
    const renderItemList = stateCallback(null, () => {
        const search = searchBar.value
        const order = orderSelector.value

        render(ItemList, itemListDiv, { search, order })
    })

    global.set('render/item-list', renderItemList)

    searchBar.addEventListener('input', () => {
        renderItemList.reload()
    })

    orderSelector.addEventListener('change', () => {
        renderItemList.reload()
    })

    //Setup item operations
    global.set('render/operations-tab', stateCallback(null, () => {render(ItemOperations, itemOperationsDiv)}))

    //Setup printing
    global.set('functions/print-function', () => {
        const content = JSON.stringify(stockManager.read())
        return {content}
    })
}

const style = "./modules/pages/styles/items-tab.css"

export const ItemsTab = {
    display: display,
    setup: setup,
    style: style
}

