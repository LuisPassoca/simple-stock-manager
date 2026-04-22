import { stockManager } from "../../stock-manager.js"

const display = (props) => {
    const alerts = stockManager.alerts()
    const alertItems = alerts.map(alert => {
        const item = stockManager.items.get(alert)

        return(`
            <span> ${item.category == 'undefined' ? 'Itens' : item.category} </span>
            <span> ${item.name} </span> 
            <span> ${item.notify} </span>
            <span> ${item.quantity} </span>
        `)
    }).join('')

    return(`
        Items em alerta:

        <div class='item-list'>
            <span> Categoria </span>
            <span> Nome </span>
            <span> Notificar em </span>
            <span> Em estoque </span>

            ${alertItems}
        </div>
    `)
}

const setup = (props) => {

}

const style = './src/css/alerts-tab.css'

export const AlertsTab = {
    display: display,
    setup: setup,
    style: style
}

