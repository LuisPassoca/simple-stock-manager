import { global } from "../../scripts/global-variables.js"

const display = () => {

    return(` 
        <div class='flex-row'>
            <div class='search-bar-wrapper'>
                <input type='text' class='search-bar' placeholder='Buscar um conjunto...' />
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <button class='add-item'> Adicionar conjunto </button>
        </div>
    `)
}

const setup = () => {
    const root = document.querySelector('.tab-display')
    global.set('functions/operation-manager', null)
}

const style = "./modules/pages/styles/bundles-tab.css"

export const BundlesTab = {
    display: display,
    setup: setup,
    style: style
}

