import { AlertsDisplay } from "./modules/components/alerts-display.js"
import { AlertsTab } from "./modules/pages/alerts-tab.js"
import { BundlesTab } from "./modules/pages/bundles-tab.js"
import { ItemsTab } from "./modules/pages/items-tab.js"
import { global } from "./scripts/global-variables.js"
import { print } from "./scripts/print.js"
import { render } from "./scripts/renderer.js"
import { stateCallback } from "./scripts/state-callback.js"

const display = () => {

    return(` 
        <div class='header default-padding'>
            <h1> 📦 Meu Estoque </h1>
            <div class="alerts-display"></div>
        </div>

        <div class='tab-selector default-padding'>
            <div class='tab-button' id='items-tab'> Itens </div>
            <div class='tab-button' id='bundles-tab'> Conjuntos </div>
            <div class='tab-button' id='alerts-tab'> Alertas </div>
            <button class='print-button'> <i class="fa-solid fa-print"></i> Imprimir </button>
        </div>

        <div class="tab-display"></div>

        <dialog class="modal-display"></dialog> 
    `)
}

const setup = (props) => {
    const root = document.querySelector('#root')
    const alertsDisplayDiv = root.querySelector('.alerts-display')
    const tabDisplayDiv = root.querySelector('.tab-display')
    const modalDisplayDiv = root.querySelector('.modal-display')
    

    //Setup alerts display
    global.set('render/alerts-display', stateCallback(null, () => {render(AlertsDisplay, alertsDisplayDiv)}))

    //Setup modal display
    //Using v as the rendering value so we can dynamically render modals
    global.set('render/modal-display', stateCallback(null, (v) => {render(v, modalDisplayDiv)}))
    
    //Tab selector
    const tabButtons = root.querySelectorAll('.tab-button')
    const printButton = root.querySelector('.print-button')

    const tabRefs = {
        'items-tab': ItemsTab,
        'bundles-tab': BundlesTab,
        'alerts-tab': AlertsTab
    }
    
    const currentTab = stateCallback('items-tab', (v, p) => {
        if (v == p) {return}

        tabButtons.forEach(button => button.classList.remove('active-tab'))
        const activeButton = document.querySelector(`#${v}`)
        activeButton.classList.add('active-tab')

        const tabToRender = tabRefs[v]
        render(tabToRender, tabDisplayDiv)
    })

    tabButtons.forEach(button => button.addEventListener('click', () => {currentTab.state = button.id}))

    printButton.addEventListener('click', () => {
        console.log(currentTab.state)
        print(`${currentTab.state}`)
    })
}

const style = undefined

export const Main = {
    display: display,
    setup: setup,
    style: style
}

