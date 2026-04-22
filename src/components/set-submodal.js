import { global, render, stateRender } from "../../renderer.js"
import { stockManager } from "../../stock-manager.js"
import { SetModal } from "./set-modal.js"

const display = ({ data = {} }) => {
    return(`
        <div class='modal'>
            <h2> Adicionar Itens </h2>

            <input class='search-bar' type='text' placeholder='buscar' />

            <form>
                <div class='item-list-3'>
                    
                </div>

                <div class='form-buttons'>
                    <button type='submit'> Adicionar </button>
                    <button type='button' class='cancel'> Cancelar </button>
                </div>
            </form>
        </div>
    `)
}

const setup = ({ type, data = {} }) => {
    const root = document.querySelector('.modal-display')

    const cancelButton = root.querySelector('.cancel')
    cancelButton.addEventListener('click', () => {
        render(SetModal, root, {type, data})
    })

    const search = new Map()
    for (const item of data.items ?? []) {
        search.set(item.id, '')
    }

    const searchBar = root.querySelector('.search-bar')
    const itemList = root.querySelector('.item-list-3')
    const renderList = stateRender(undefined, () => {
        const stock = stockManager.get()

        stock.sort((a, b) => a.category.localeCompare(b.category, {numeric: true}))
        stock.forEach(element => element.items.sort((a, b) => a.name.localeCompare(b.name, {numeric: true})))

        const searchBarValue = searchBar.value

        const displayItems = stock.map(element => {
            return element.items.map(item => {
                const lName = item.name.toLowerCase()
                const lSearch = searchBarValue.toLowerCase()
                if (!lName.includes(lSearch)) {return}
                
                return(`
                    <span> ${item.name} </span>
                    <span> ${element.category} </span>
                    <input type='checkbox' id='${item.id}' ${search.has(item.id) ? 'checked' : ''}/>
                `)}).join('')
        }).join('')

        itemList.innerHTML = `
            <span> Item </span>
            <span> Categoria </span>
            <span> Adicionar </span>

            ${displayItems}
        `

        const checkBoxes = root.querySelectorAll('input[type = checkbox]')
        checkBoxes.forEach(checkBox => {
            checkBox.addEventListener('change', () => {
                if (checkBox.checked) {search.set(checkBox.id, '')}
                else (search.delete(checkBox.id))
            })
        })
    })

    
    searchBar.addEventListener('input', () => {
        renderList.update()
    })

    const form = root.querySelector('form')
    form.addEventListener('submit', (event) => {
        event.preventDefault()

        const searchMap = new Map()
        data.items?.forEach(item => searchMap.set(item.id, item))

        const newData = {name: data.name, items: [], id: data.id}

        for (const [key, value] of search) {
            if (searchMap.has(key)) {newData.items.push(searchMap.get(key))}
            else {newData.items.push({id: key})}
        }

        /*
        const checkedItems = root.querySelectorAll('input[type = checkbox]:checked')

        checkedItems.forEach(item => {
            if (searchMap.has(item.id)) {newData.items.push(searchMap.get(item.id))}
            else {newData.items.push({id: item.id})}
        })*/

        render(SetModal, root, {type, data: newData})
    })
}

const style = undefined

export const SetSubModal = {
    display: display,
    setup: setup,
    style: style
}

