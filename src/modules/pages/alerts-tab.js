import { stockManager } from "../../scripts/stock-manager.js"
import { global } from "../../scripts/global-variables.js"
import { i18n } from "../../scripts/i18n.js"

const display = () => {
    const alertsIds = stockManager.alerts()
    const { itemManager } = stockManager
    
    const alertItems = Object.entries(alertsIds).map(([index, id]) => {
        return(itemManager.read(id))
    })

    alertItems.sort((a, b) => (a.quantity - b.quantity))
  
    const alerts = alertItems.map(item => {
        return(`
            <span class='item-name'> ${item.name} </span>
            <span> ${item.quantity} </span>
            <span> ${item.minimum} </span>
            <span> ${item.category} </span>
        `)
    }).join('')

    return(` 
        <div class='alert-list'>
            <span> ${i18n.t('name')} </span>
            <span> ${i18n.t('quantity')} </span>
            <span> ${i18n.t('minimum')} </span>
            <span> ${i18n.t('category')} </span>
            ${alerts}
        </div>
    `)
}

const setup = () => {
    const root = document.querySelector('.tab-display')
    global.set('functions/operation-manager', null)
}

const style = "./modules/pages/styles/alerts-tab.css"

export const AlertsTab = {
    display: display,
    setup: setup,
    style: style
}

