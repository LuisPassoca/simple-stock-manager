import { global, render } from "../../renderer.js"
import { stockManager } from "../../stock-manager.js"
import { ItemModal } from "./item-modal.js"

const display = (props) => {
    const operations = global.get('operations').read()
    
    const operationsDisplay = operations.map(({id, operation, result}) => {
        const item = stockManager.items.get(id)
        
        return(`
            <p> ${item.name + ': ' + (operation > 0 ? '+' : '') + operation + ' ⇒ ' + result}</p>
        `)
    }).join('')

    return(`
        <h3> Operações </h3>  

        <div class='operations'>
            ${operationsDisplay}
        </div>

        <button class='apply-all'> Aplicar todas </button>
    `)
}

const setup = (props) => {
    const root = document.querySelector('.item-operations')

    const applyAllButton = root.querySelector('.apply-all')
    applyAllButton.addEventListener('click', () => {
        global.get('operations').applyAll()
        global.get('render/itemList').update()
        global.get('render/itemOperations').update()
    })
}

const style = undefined

export const ItemOperations = {
    display: display,
    setup: setup,
    style: style
}

