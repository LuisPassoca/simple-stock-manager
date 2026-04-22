import { global, render } from "../../renderer.js"
import { stockManager } from "../../stock-manager.js"
import { ItemModal } from "./item-modal.js"
import { SetModal } from "./set-modal.js"

const display = ({search}) => {
    global.get('alerts').value = stockManager.alerts()
    const sets = stockManager.sets.getAll()
    const operations = global.get('operations')

    const listContent = sets.map(set => {
        const lName = set.name.toLowerCase()
        const lSearch = search.toLowerCase()
        if (!lName.includes(lSearch)) {return}

        return(`
            <span class='set-name'> ${set.name} </span>
            <div id='${set.id}' class='set-operation'>
                <input type='text' class='input-operation' placeholder='0' value='${operations.get(set.id) || ''}' />
                <button class='discount-operation'> Descontar </button>
                <button class='edit-set'> Editar </button>
            </div>
        `)
    }).join('')

    return(listContent)
}

const setup = (props) => {
    const operations = global.get('operations')
    const root = document.querySelector('.item-list')
    const modalDisplay = document.querySelector('.modal-display')

    const setOperationDivs = document.querySelectorAll('.set-operation')
    setOperationDivs.forEach(div => {
        const operationInput = div.querySelector('.input-operation')
        const discountOperationButton = div.querySelector('.discount-operation')
        const editSetButton = div.querySelector('.edit-set')
        const set = stockManager.sets.get(div.id)

        let previousValue = 0
        operationInput.addEventListener('input', () => {
            const inputRules = /^\d*$/
            const allowed = inputRules.test(operationInput.value)

            if (!allowed) {operationInput.value = previousValue}

            const value = Number(operationInput.value) || 0
            const added = operations.set(set.id, value)
            if (!added) {operationInput.value = previousValue}

            previousValue = operationInput.value
        })

        discountOperationButton.addEventListener('click', () => {
            const applied = operations.apply(set.id)
            if (applied !== true) {
                const invalidItems = applied.map(item => (`Item: ${item.name} > Necessários: ${item.needed} > Em estoque: ${item.stock}`)).join('\n')
                window.electronAPI.message(`Erro! Os seguintes items são inválidos:\n${invalidItems}`)
            } else {window.electronAPI.message(`Sucesso, os itens foram descontados!`)}
            global.get('render/setList').update()
        })

        editSetButton.addEventListener('click', () => {
            render(SetModal, modalDisplay, {type: 'edit', data: {name: set.name, id: set.id, items: set.items}})
        })
    })
}

const style = undefined

export const SetList = {
    display: display,
    setup: setup,
    style: style
}

