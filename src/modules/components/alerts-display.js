import { i18n } from "../../scripts/i18n.js"
import { stockManager } from "../../scripts/stock-manager.js"

const display = () => {
    const { itemManager } = stockManager
    const alerts = stockManager.alerts()
    let low = 0
    let out = 0

    for (const alert of alerts) {
        const item = itemManager.read(alert)
        if (item.quantity == 0) {out++}
        else {low++}
    }

    return(` 
        <span> ${i18n.t('low-stock')}: ${low} ${i18n.t('items-lowercase')} </span>
        <span> ${i18n.t('out-of-stock')}:  ${out} ${i18n.t('items-lowercase')} </span>
    `)
}

const setup = () => {
    
}

const style = undefined

export const AlertsDisplay = {
    display: display,
    setup: setup,
    style: style
}

