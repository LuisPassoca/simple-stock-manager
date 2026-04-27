import { global } from "../../scripts/global-variables.js"
import { render } from "../../scripts/renderer.js"
import { stateCallback } from "../../scripts/state-callback.js"
import { ItemModal } from "../components/item-modal.js"
import { ItemList } from "../components/item-list.js"
import { ItemOperations } from "../components/item-operations.js"
import { ItemOperationManager, stockManager } from "../../scripts/stock-manager.js"
import { i18n } from "../../scripts/i18n.js"

const display = () => {

    return(` 
        <div class='items-tab'>
            <div class='flex-row'>
                <div class='search-bar-wrapper'>
                    <input type='text' class='search-bar' placeholder='${i18n.t('search-for-an-item')}' />
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <button class='add-item'> ${i18n.t('add-item')} </button>
            </div>
        
            <div class='flex-row order-row'>
                <label for='order-selector'> ${i18n.t('order-by')}: </label>
                <select class='order-selector'>
                    <option value='name'> ${i18n.t('name')} </option>
                    <option value='least'> ${i18n.t('least')} </option>
                    <option value='most'> ${i18n.t('most')} </option>
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

    //Setup item operations
    const operationManager = new ItemOperationManager()
    global.set('functions/operation-manager', operationManager)
    global.set('render/operations-tab', stateCallback(null, () => {render(ItemOperations, itemOperationsDiv, {operationManager})}))

    //Setup item list & handle search and order
    const renderItemList = stateCallback(null, () => {
        const search = searchBar.value
        const order = orderSelector.value

        render(ItemList, itemListDiv, { search, order, operationManager })
    })

    global.set('render/item-list', renderItemList)

    searchBar.addEventListener('input', () => {
        renderItemList.reload()
    })

    orderSelector.addEventListener('change', () => {
        renderItemList.reload()
    })

    //Setup printing
    global.set('functions/print', () => {
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

