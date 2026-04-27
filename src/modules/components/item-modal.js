import { global } from "../../scripts/global-variables.js"
import { i18n } from "../../scripts/i18n.js"
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
            <h2> ${i18n.t('add-item')} </h2>

            <form class='flex-wrapper'>
                <div class='flex-row'>
                    <label for='item-name'> ${i18n.t('name')}: </label>
                    <input id='item-name' name='name' type='text' value='${item.name}' required />
                </div>

                <div class='flex-row'>
                    <label for='item-quantity'> ${i18n.t('quantity')}: </label>
                    <input id='item-quantity' name='quantity' type='number' min='0' placeholder='0' value='${item.quantity}'/>
                    <span> un. </span>
                </div>

                <div class='flex-row'>
                    <label for='item-minimum'> ${i18n.t('minimum')}: </label>
                    <input id='item-minimum' name='minimum' type='number' min='0' placeholder='0' value='${item.minimum}' />
                    <span> un. </span>
                </div>

                <div class='flex-row'>
                    <label for='item-category'> ${i18n.t('category')}: </label>
                    <select id='item-category' name='category' required>
                        <option value=''> ${i18n.t('select-a-category')} </option>
                        <option value='-_add_-'> ${i18n.t('add-category')} </option>
                        ${categories}
                    </select>
                </div>

                <div class='flex-row hidden'>
                    <label for='new-category'> ${i18n.t('new-category')}: </label>
                    <input id='new-category' name='new-category' type='text' />
                </div>

                <button type='submit'> ${edit ? `${i18n.t('edit')}` : `${i18n.t('add')}`} </button>
                ${edit ? `<button type='button' class='remove'> ${i18n.t('remove')} </button>` : ''}
                <button type='button' class='cancel'> ${i18n.t('cancel')} </button>
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
        global.get('render/operations-tab').reload()
        global.get('render/alerts-display').reload()
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
        
        if (!success) {window.alert(i18n.t('something-went-wrong'))}
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

    //Handle remove
    if (edit) {
        const removeButton = modal.querySelector('.remove')
        removeButton.addEventListener('click', () => {
            const confirm = window.eAPI.confirm(i18n.t('are-you-sure-item'))
            if (confirm) {itemManager.delete(id)}
            closeModal()
        })
    }

    modal.showModal()
}

const style = undefined

export const ItemModal = {
    display: display,
    setup: setup,
    style: style
}

