import { global, render, stateRender } from "../../renderer.js"
import { ItemOperationsManager, stockManager } from "../../stock-manager.js"
import { ItemList } from "../components/item-list.js"
import { ItemModal } from "../components/item-modal.js"
import { ItemOperations } from "../components/item-operations.js"

const display = (props) => {

    return(`
        <link rel='stylesheet' href='./src/css/modal.css'>

        <div class='item-list'>
            <input type='text' class='search-bar' placeholder='Buscar item...' />
            <button class='add-item'> Adicionar item </button>
            <button class='print-stock'> Imprimir estoque </button>
            <label for='order-selector'> Ordenar: </label>
            <select class='order-selector'>
                <option value='name'> Nome </option>
                <option value='least'> Menor qtd. </option>
                <option value='most'> Maior qtd. </option>
            </select>

            <div class='item-list-display'></div>
        </div>
    
        <div class='item-operations'></div>
    `)
}

const setup = (props) => {
    const root = document.querySelector('.tab-display')
    const searchBar = root.querySelector('.search-bar')
    const orderSelector = root.querySelector('.order-selector')

    const operations = new ItemOperationsManager()
    global.set('operations', operations)

    const listDisplay = document.querySelector('.item-list-display')
    const renderList = stateRender(undefined, () => {
        const search = searchBar.value
        const order = orderSelector.value
        render(ItemList, listDisplay, {search, order})
    })
    global.set('render/itemList', renderList)

    searchBar.addEventListener('input', () => {
        renderList.update()
    })

    orderSelector.addEventListener('change', () => {
        renderList.update()
    })

    const operationsDisplay = document.querySelector('.item-operations')
    const renderOperations = stateRender(undefined, () => {
        render(ItemOperations, operationsDisplay)
    })
    global.set('render/itemOperations', renderOperations)

    const modalDisplay = document.querySelector('.modal-display')
    const addItemButton = document.querySelector('.add-item')
    addItemButton.addEventListener('click', () => {
        render(ItemModal, modalDisplay, {type: 'add'})
    })

    function printStock() {
        const iframe = document.createElement('iframe')
        document.body.appendChild(iframe)

        const stock = stockManager.get()

        const content = stock.map(element => {
            const items = element.items.map(item => (`<span> ${item.name} </span> <span> ${item.quantity} </span> <span> </span>`)).join('')
            
            return(`<h2> ${element.category} </h2> <div class='iframe-list'> <span> Nome </span> <span> Qtd. </span> <span> </span> ${items} </div>`)
        }).join('')

        const print = iframe.contentWindow.document
        print.open()
        print.write(`<html>
                        <head>
                        <style>
                        body {font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;}
                        .iframe-list {display: grid; grid-template-columns: 1fr max-content 1fr;}

                        </style>
                        </head>
                        <body> ${content} </body>
                    </html>`)
        print.close()

        iframe.contentWindow.focus()
        iframe.contentWindow.print()

        setTimeout(() => {iframe.remove()}, 10)
    }

    const printButton = document.querySelector('.print-stock')
    printButton.addEventListener('click', printStock)
}

const style = './src/css/items-tab.css'

export const ItemsTab = {
    display: display,
    setup: setup,
    style: style
}

