import { global } from "../../scripts/global-variables.js"
import { stockManager } from "../../scripts/stock-manager.js"

const display = ({ edit = false, id }) => {
    const stock = stockManager.read()
    const { itemManager } = stockManager
    const categories = stock.map(({category}) => (`<option value='${category}'> ${category} </option>`)).join('')

    const item = {
        name: '',
        category: '',
        quantity: '',
        minimum: '',
        ...itemManager.read(id)
    }

    return(` 
        <div class='flex-wrapper'>
            <h2> Adicionar item </h2>

            <form class='flex-wrapper'>
                <div class='flex-row'>
                    <label for='item-name'> Nome: </label>
                    <input id='item-name' name='name' type='text' value='${item.name}' required />
                </div>

                <div class='flex-row'>
                    <label for='item-quantity'> Quantidade: </label>
                    <input id='item-quantity' name='quantity' type='number' min='0' placeholder='0' value='${item.quantity}'/>
                    <span> un. </span>
                </div>

                <div class='flex-row'>
                    <label for='item-minimum'> Mínimo: </label>
                    <input id='item-minimum' name='minimum' type='number' min='0' placeholder='0' value='${item.minimum}' />
                    <span> un. </span>
                </div>

                <div class='flex-row'>
                    <label for='item-category'> Categoria: </label>
                    <select id='item-category' name='category' required>
                        <option value=''> Selecione uma categoria </option>
                        <option value='-_add_-'> Adicionar </option>
                        ${categories}
                    </select>
                </div>

                <div class='flex-row hidden'>
                    <label for='new-category'> Nova categoria: </label>
                    <input id='new-category' name='new-category' type='text' />
                </div>

                <button type='submit'> ${edit ? 'Editar' : 'Adicionar'} </button>
                <button type='button' class='cancel'> Cancelar </button>
                ${edit ? `<button type='button' class='remove'> Remover </button>` : ''}
            </form>
        </div>
    `)
}

const setup = ({ edit = false, id }) => {
    const modal = document.querySelector('.modal-display')
    const { itemManager } = stockManager

    //Handle modal closing
    function closeModal() {
        global.get('render/item-list').reload()
        modal.close()
    }

    //Handle form submit
    const form = modal.querySelector('form')

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const formData = Object.fromEntries(new FormData(form))

        const item = {
            name: formData.name,
            category: formData.category == '-_add_-' ? formData['new-category'] : formData.category,
            quantity: Number(formData.quantity) || 0,
            minimum: Number(formData.minimum) || 0
        }

        let success
        if (edit) {success = itemManager.update(id, item)} 
        else {success = itemManager.create(item)}
        
        if (!success) {window.alert('Algo deu errado! Por favor tente novamente.')}
        closeModal()
    })

    //Handle categories
    const categorySelector = form.querySelector('#item-category')
    const newCategoryInput = form.querySelector('#new-category')

    categorySelector.addEventListener('change', () => {
        const newCategoryParent = newCategoryInput.parentElement
        newCategoryParent.classList.toggle('hidden', categorySelector.value != '-_add_-')
        newCategoryInput.required = !newCategoryParent.classList.contains('hidden')
    })

    if (edit) {
        const { category } = itemManager.read(id)
        categorySelector.value = category
    }

    //Handle cancel
    const cancelButton = modal.querySelector('.cancel')
    cancelButton.addEventListener('click', () => {modal.close()})

    modal.showModal()
}

const style = undefined

export const ItemModal = {
    display: display,
    setup: setup,
    style: style
}

