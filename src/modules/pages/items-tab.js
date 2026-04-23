import { global } from "../../scripts/global-variables.js"
import { render } from "../../scripts/renderer.js"
import { stateCallback } from "../../scripts/state-callback.js"
import { ItemModal } from "../components/item-modal.js"
import { ItemList } from "../components/item-list.js"
import { ItemOperations } from "../components/item-operations.js"

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

    const searchBar = root.querySelector('.search-bar')
    const orderSelector = root.querySelector('.order-selector')
    const addItemButton = root.querySelector('.add-item')

    //Setup add button
    addItemButton.addEventListener('click', () => {
        global.get('render/modal-display').state = ItemModal
    })

    //Setup item list
    global.set('render/item-list', stateCallback(null, () => {render(ItemList, itemListDiv)}))

    //Setup item operations
    global.set('render/operations-tab', stateCallback(null, () => {render(ItemOperations, itemOperationsDiv)}))
}

const style = "./modules/pages/styles/items-tab.css"

export const ItemsTab = {
    display: display,
    setup: setup,
    style: style
}

