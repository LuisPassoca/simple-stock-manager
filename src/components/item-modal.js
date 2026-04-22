import { global } from "../../renderer.js"
import { stockManager } from "../../stock-manager.js"

const display = ({ type, data = {}}) => {
    const stock = stockManager.get()
    const categories = stock.map(({category}) => {
        if (category == 'undefined') {return}
        return(`<option value='${category}'> ${category} </option>`)
    }).join('')

    const name = data.name || ''
    const quantity = data.quantity || ''
    const notify = data.notify || ''

    return(`
        <div class='modal'>
            <h2> ${type == 'add' ? 'Adicionar' : 'Editar'} Item </h2>

            <form>
                <div class='form-row'>
                    <label for='name'> Nome: </label>
                    <input name='name' type='text' value='${name}' required />
                </div>

                <div class='form-row'>
                    <label for='quantity'> Quantidade: </label>
                    <input name='quantity' type='number' min='0' placeholder='0' value='${quantity}'/>
                    <span> un. </span>
                </div>

                <div class='form-row'>
                    <label for='notify'> Notificar em: </label>
                    <input name='notify' type='number' min='0' placeholder='0' value='${notify}'/>
                    <span> un. </span>
                </div>

                <div class='form-row'>
                    <label for='category'> Categoria: </label>
                    <select name='category' class='category-selector' required>
                        <option value=''> Selecione uma categoria </option>
                        <option value='-_add_-'> Adicionar </option>
                        ${categories}
                    </select>
                </div>

                <div class='form-row add-new-category hidden'>
                    <label for='new-category'> Nova categoria: </label>
                    <input name='new-category' type='text' />
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
    const renderList = global.get('renderList')
    const root = document.querySelector('.modal-display')

    const categorySelector = root.querySelector('.category-selector')
    if (type == 'edit') {categorySelector.value = data.category}

    const addNewCategory = root.querySelector('.add-new-category')

    categorySelector.addEventListener('change', () => {
        addNewCategory.classList.toggle('hidden', categorySelector.value != '-_add_-')

        const input = addNewCategory.querySelector('input')
        if (addNewCategory.classList.contains('hidden')) {input.required = false}
        else {input.required = true}
    })

    const closeModal = () => {
        root.innerHTML = ''
        global.get('render/itemList').update()
        global.get('render/itemOperations').update()
    }

    const form = root.querySelector('form')
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        
        const formData = Object.fromEntries(new FormData(form))

        const item = {
            name: formData.name,
            category: formData.category == '-_add_-' ? formData['new-category'] : formData.category,
            quantity: Number(formData.quantity) || 0,
            notify: Number(formData.notify) || 0
        }

        let sucessfull = false;

        if (type == 'add') {sucessfull = stockManager.items.add(item)}
        if (type == 'edit') {sucessfull = stockManager.items.edit(data.id, item)}

        if (sucessfull) {closeModal()}
    })

    if (type == 'edit') {
        const removeButton = root.querySelector('.remove')
        removeButton.addEventListener('click', () => {
            const confirm = window.electronAPI.confirm(`Excluir o item '${data.name}'?`)
            if (!confirm) {return}

            stockManager.items.remove(data.id)
            global.get('operations').delete(data.id)
            closeModal()
        })
    }
    
    const cancelButton = root.querySelector('.cancel')
    cancelButton.addEventListener('click', closeModal)
}

const style = undefined

export const ItemModal = {
    display: display,
    setup: setup,
    style: style
}

