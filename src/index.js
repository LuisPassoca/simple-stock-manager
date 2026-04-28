import { AlertsDisplay } from "./modules/components/alerts-display.js"
import { AlertsTab } from "./modules/pages/alerts-tab.js"
import { BundlesTab } from "./modules/pages/bundles-tab.js"
import { ItemsTab } from "./modules/pages/items-tab.js"
import { global } from "./scripts/global-variables.js"
import { i18n } from "./scripts/i18n.js"
import { print } from "./scripts/print.js"
import { render } from "./scripts/renderer.js"
import { stateCallback } from "./scripts/state-callback.js"

const display = () => {
    i18n.locale = localStorage.getItem('locale') || 'pt-br'

    return(` 
        <div class='header default-padding'>

            <div class='header-language-wrapper'>
                <h1> 📦 ${i18n.t('my-stock')} </h1>
                <div class='language-wrapper'> 
                    <i class="fa-solid fa-language"></i> 
                    <select class='language-selector'> 
                        <option value='pt-br'> PT-BR </option> 
                        <option value='en'> EN </option> 
                    </select> 
                </div>
            </div>

            <div class="alerts-display"></div>
        </div>

        <div class='tab-selector default-padding'>
            <div class='tab-button' id='items-tab'> ${i18n.t('items')} </div>
            <div class='tab-button' id='bundles-tab'> ${i18n.t('bundles')} </div>
            <div class='tab-button' id='alerts-tab'> ${i18n.t('alerts')} </div>
            <button class='print-button'> <i class="fa-solid fa-print"></i> ${i18n.t('print')} </button>
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

    //Setup app title
    document.title = i18n.t('stock-manager')
    
    //Setup globals
    global.set('render/alerts-display', stateCallback(null, () => {render(AlertsDisplay, alertsDisplayDiv)}))
    global.set('render/modal-display', stateCallback({ page: null }, ({ page, props }) => {render(page, modalDisplayDiv, props)}))
    global.set('functions/operation-manager', null)

    //Tab selector
    const tabButtons = root.querySelectorAll('.tab-button')
    const printButton = root.querySelector('.print-button')

    const tabRefs = {
        'items-tab': ItemsTab,
        'bundles-tab': BundlesTab,
        'alerts-tab': AlertsTab
    }
    
    const currentTab = stateCallback('items-tab', (v) => {
        tabButtons.forEach(button => button.classList.remove('active-tab'))
        const activeButton = document.querySelector(`#${v}`)
        activeButton.classList.add('active-tab')

        const tabToRender = tabRefs[v]
        render(tabToRender, tabDisplayDiv)
    })

    //Add event listener to buttons
    tabButtons.forEach(button => button.addEventListener('click', () => {
        if (currentTab.state == button.id) {return}

        //Handle pending operations before switching
        const operationManager = global.get('functions/operation-manager')
        const pending = operationManager?.pending()
        if (pending) {
            const response = window.eAPI.saveDiscard(i18n.t('pending-operations-message'))

            if (response == 0) {operationManager?.applyAll()}
            if (response == 2) {return}
        }

        global.get('render/alerts-display').reload()
        currentTab.state = button.id
    }))

    //Handle language
    const languageSelector = root.querySelector('.language-selector') 
    languageSelector.value = localStorage.getItem('locale') || 'pt-br'

    languageSelector.addEventListener('change', () => {
        localStorage.setItem('locale', languageSelector.value)
        const message = languageSelector.value == 'en' ? 
            'Please restart the app for changes to take effect!'  :
            'Por favor reinicie o aplicativo para efetivar as mudanças!'
        window.eAPI.message(message)    
    })

    //Handle printing
    global.set('functions/print', () => ({ content: 'Hello world!' }))

    printButton.addEventListener('click', () => {
        const printFunction = global.get('functions/print')
        const { content , style } = printFunction()
        print(`${content}`, style)
    })
}

const style = undefined

export const Main = {
    display: display,
    setup: setup,
    style: style
}

