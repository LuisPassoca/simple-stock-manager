import { render, stateRender, global } from '../renderer.js'
import { ItemsTab } from './modules/items-tab.js'
import { SetsTab } from './modules/sets-tab.js'
import { AlertsTab } from './modules/alerts-tab.js'
import { stockManager } from '../stock-manager.js'

const display = () => {

    return(`        
        <h1> Meu Estoque </h2>

        <div class='alerts-display' style='color: red;'></div>

        <div class='tab-selector'>
            <button class='tab-buttons' id='items-tab'> Itens </button>
            <button class='tab-buttons' id='sets-tab'> Conjuntos </button>
            <button class='tab-buttons' id='alerts-tab'> Alertas </button>
        </div>

        <div class='tab-display'></div>
        <div class='modal-display'></div>
    `)
}

const setup = () => {
    const tabs = {
        'items-tab': ItemsTab,
        'sets-tab': SetsTab,
        'alerts-tab': AlertsTab
    }

    const alertsDiv = document.querySelector('.alerts-display')
    const renderAlerts = stateRender(false, (v) => {
        alertsDiv.innerHTML = v ? 'Existem itens em alerta!' : ''
    })
    global.set('alerts', renderAlerts)
    

    const tabDisplay = document.querySelector('.tab-display')
    let currentTab = 'items-tab'

    const renderTab = stateRender(undefined, () => {
        render(tabs[currentTab], tabDisplay)
    })

    const tabButtons = document.querySelectorAll('div.tab-selector button')
    tabButtons.forEach(button => 
       button.addEventListener('click', () => {
            const tab = button.id
            if (tab == currentTab) {return}

            const operations = global.get('operations')
            const pending = operations.pending()

            if (pending) {
                const answer = window.electronAPI.saveDiscard('Existem operações pendentes! \nAplicar todas?')
                
                if (answer == 0) {operations.applyAll()}
                if (answer == 1) {operations.clear()}
                if (answer == 2) {return}
            }

            currentTab = tab
            renderTab.update()
       })
    )    
}

const style = './src/main.css'

export const Main = {
    display: display,
    setup: setup,
    style: style
}

