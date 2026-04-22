import { global, render, stateRender } from "../../renderer.js"
import { SetOperationsManager} from "../../stock-manager.js"
import { SetList } from "../components/set-list.js"
import { SetModal } from "../components/set-modal.js"
import { SetOperations } from "../components/set-operations.js"

const display = (props) => {
    

    return(`
        <link rel='stylesheet' href='./src/css/modal.css'>

        <div class='set-list'>
            <input type='text' class='search-bar' placeholder='Buscar conjunto...' />
            <button class='add-set'> Adicionar conjunto </button>

            <div class='set-list-display'></div>
        </div>
    
        <div class='set-operations'></div>
    `)
}

const setup = (props) => {
    const root = document.querySelector('.tab-display')
    const searchBar = root.querySelector('.search-bar')

    const operations = new SetOperationsManager()
    global.set('operations', operations)

    const listDisplay = document.querySelector('.set-list-display')
    const renderList = stateRender(undefined, () => {
        const search = searchBar.value
        render(SetList, listDisplay, {search})
    })
    global.set('render/setList', renderList)
    
    searchBar.addEventListener('input', () => {
        renderList.update()
    })

    const operationsDisplay = document.querySelector('.set-operations')
    const renderOperations = stateRender(undefined, () => {
        //render(SetOperations, operationsDisplay)
    })
    global.set('render/setOperations', renderOperations)

    const modalDisplay = document.querySelector('.modal-display')
    const addSetButton = document.querySelector('.add-set')
    addSetButton.addEventListener('click', () => {
        render(SetModal, modalDisplay, {type: 'add'})
    })
}

const style = './src/css/sets-tab.css'

export const SetsTab = {
    display: display,
    setup: setup,
    style: style
}

