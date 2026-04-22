import { global, render } from "../../renderer.js"
import { stockManager } from "../../stock-manager.js"
import { SetSubModal } from "./set-submodal.js"

const display = ({ type, data = {}}) => {
    console.log(data)
    const items = {}
    data.items?.forEach(item => {
        const stockItem = stockManager.items.get(item.id)
        if (!items[stockItem.category]) {items[stockItem.category] = []}
        items[stockItem.category].push({id: item.id, category: stockItem.category, name: stockItem.name, quantity: item.quantity})
    })

    //items.sort((a, b) => a.category.localeCompare(b.category, {numeric: true}))
    //items.sort((a, b) => a.name.localeCompare(b.name, {numeric: true}))
    console.log(items)

    const displayItems = (data.items ?? []).map(item => {
        const stockItem = stockManager.items.get(item.id)

        return(`
            <span> ${stockItem.name} </span>
            <span> ${stockItem.category} </span>
            <input type='number' placeholder='0' min='1' class='item-quantity' id='${item.id}' value='${item.quantity || ''}' required>
        `)
    }).join('') 

    return(`
        <div class='modal'>
            <h2> ${type == 'add' ? 'Adicionar' : 'Editar'} Conjunto </h2>

            <form>
                <div class='form-row'>
                    <label for='name'> Nome: </label>
                    <input name='name' class='set-name' type='text' value='${data.name || ''}' required />
                    <button type='button' class='add-items'> Adicionar Itens </button>
                </div>

                <div class='item-list-3'>
                    <span> Nome </span>
                    <span> Categoria </span>
                    <span> Qtd. </span>

                    ${displayItems}
                </div>

                <div class='form-buttons'>
                    <button type='submit'> ${type == 'add' ? 'Adicionar' : 'Editar'} </button>
                    <button type='button' class='cancel'> Cancelar </button>
                    ${type == 'add' ? '' : `<button type='button' class='remove'> Remover </button>`}
                </div>
            </form>
        </div>
    `)
}

const setup = ({type, data}) => {
    const root = document.querySelector('.modal-display')

    const itemsSub = []
    data?.items?.forEach(item => {
        const stockItem = stockManager.items.get(item.id)
        itemsSub.push({id: item.id, category: stockItem.category, name: stockItem.name, quantity: item.quantity})
    })

    const setName = root.querySelector('.set-name')
    const addItemsButton = root.querySelector('.add-items')
    addItemsButton.addEventListener('click', () => {
        render(SetSubModal, root, {type, data: {name: setName.value, items: itemsSub, id: data?.id }})
    })

    const cancelButton = root.querySelector('.cancel')
    cancelButton.addEventListener('click', () => {root.innerHTML = ''})

    const form = root.querySelector('form')
    form.addEventListener('submit', (event) => {
        event.preventDefault()

        const itemsToAdd = document.querySelectorAll('.item-quantity')
        const items = []
        itemsToAdd.forEach(item => {
            items.push({id: item.id, quantity: item.valueAsNumber})
        })

        if (items.length == 0) {window.electronAPI.message('Adicione ao menos um item!'); return}

        if (type == 'edit') {stockManager.sets.edit(data.id, {name: setName.value, items})}
        if (type == 'add') {stockManager.sets.add(setName.value, items)}
        global.get('render/setList').update()
        root.innerHTML = ''
    })

    if (type == 'edit') {
        const removeButton = root.querySelector('.remove')
        removeButton.addEventListener('click', () => {
            const confirm = window.electronAPI.confirm(`Excluir o conjunto '${data.name}'?`)
            if (!confirm) {return}

            stockManager.sets.remove(data.id)
            global.get('render/setList').update()
            root.innerHTML = ''
        })

    }
}

const style = undefined

export const SetModal = {
    display: display,
    setup: setup,
    style: style
}

