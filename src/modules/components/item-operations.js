import { global } from "../../scripts/global-variables.js"
import { i18n } from "../../scripts/i18n.js"
import { stockManager } from "../../scripts/stock-manager.js"

const display = ({ operationManager }) => {
    const { itemManager } = stockManager

    const operations = operationManager.getAll().map(({id, operation, result}) => {
        const item = itemManager.read(id)

        return(`
            <div class='operation-card'>
                <div class='card-row'>
                    <b> ${item.name} </b> 
                    <b> [<span class='${operation > 0 ? 'positive' : 'negative'}'> ${operation > 0 ? '+' : ''}${operation} </span>] </b>
                </div>
                <div class='card-row'>
                    <i> ${item.category} </i> 
                    <p> [${item.quantity} ⇒ ${result}] </p>
                </div>
            </div>
        `)
    }).join('')

    return(` 
        <h3> ${i18n.t('operations')} </h3>

        ${operations}

        <button class='apply-all'> ${i18n.t('apply-all')} </button>
    `)
}

const setup = ({ operationManager }) => {
    const root = document.querySelector('.tab-display')
    const applyAllButton = root.querySelector('.apply-all')

    applyAllButton.addEventListener('click', () => {
        if (!operationManager.pending()) {return}

        const confirm = window.eAPI.confirm(i18n.t('confirm-apply-all'))
        if (!confirm) {return}

        operationManager.applyAll()
        global.get('render/item-list').reload()
        global.get('render/operations-tab').reload()
        global.get('render/alerts-display').reload()
    })
}

const style = undefined

export const ItemOperations = {
    display: display,
    setup: setup,
    style: style
}

