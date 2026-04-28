import { global } from "../../scripts/global-variables.js"
import { i18n } from "../../scripts/i18n.js"
import { stateCallback } from "../../scripts/state-callback.js"
import { stockManager } from "../../scripts/stock-manager.js"

const display = ({ edit = false, id }) => {
    const stock = stockManager.read()
    const { bundleManager } = stockManager

    const bundle = {
        name: '',
        items: [],
        ...bundleManager.read(id)
    }

    const items = stock.map(c => {
        const categoryItems = c.items.map(i => {
            return(`
                <span class='span-wrapper' title='${i.name}' data-name='${i.name}'> ${i.name} </span>
                <span class='span-wrapper' title='${i.category}' data-name='${i.name}'> ${i.category} </span>
                <input type='checkbox' id='${i.id}' data-category='${i.category}' data-name='${i.name}'/>
            `)
        }).join('')

        return categoryItems
    }).join('')

    return(` 
        <div class='item-menu hidden'>
            <h2> ${i18n.t('select-items')} </h2>
            <input class='item-searchbar' placeholder='${i18n.t('search-for-an-item')}...' />
    
            <div class='grid-wrapper'>
                <div class='grid-3 item-list'>
                    <span class='column-header'> ${i18n.t('name')} </span>
                    <span class='column-header'> ${i18n.t('category')} </span>
                    <span class='column-header'> ${i18n.t('add')} </span>

                    ${items}
                </div>
            </div>

            <button class='items-ok'> OK </button>
        </div>

        <div class='flex-wrapper'>
            <h2> ${edit ? i18n.t('edit-bundle') : i18n.t('add-bundle')}  </h2>

            <form class='flex-wrapper'>
                <div class='flex-row'>
                    <label for='bundle-name'> ${i18n.t('name')}: </label>
                    <input id='bundle-name' name='name' type='text' value='${bundle.name}' required />
                    <button type='button' class='select-items'> ${i18n.t('select-items')} </button>
                </div>

                <div class='grid-wrapper'>
                    <div class='grid-3 selected-items'> 
                    </div>
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
    const { bundleManager } = stockManager

    //Closing modal
    const closeModal = () => {
        global.get('render/bundle-list').reload()
        modal.close()
    }

    //Setup quantities
    const itemQuantities = new Map()
    const saveItemQuantities = () => {
        const itemInputs = modal.querySelectorAll('input[type=number]')
        itemInputs.forEach(i => {itemQuantities.set(i.id, i.valueAsNumber)})
    }

    //Setup menu
    const selectItemsButton = modal.querySelector('.select-items')
    selectItemsButton.addEventListener('click', () => {
        itemMenu.classList.remove('hidden')
        saveItemQuantities()
    })

    //Handle insertion
    const itemMenu = modal.querySelector('.item-menu')
    const itemsOkButton = modal.querySelector('.items-ok')
    const selectedItemsDiv = modal.querySelector('.selected-items')

    const selectedItems = stateCallback('', (v) => {
        selectedItemsDiv.innerHTML = `
            <span> ${i18n.t('name')} </span>
            <span> ${i18n.t('category')} </span>
            <span> ${i18n.t('qtt')} </span>

            ${v}
        `
    })

    itemsOkButton.addEventListener('click', () => {
        const checkedItems = [...modal.querySelectorAll(`input[type=checkbox]:checked`)]
        const items = checkedItems.map(i => {
            return(`
                <span class='span-wrapper'> ${i.dataset.name}  </span>
                <span class='span-wrapper'> ${i.dataset.category} </span>
                <input type='number' min='1' id='${i.id}' value='${itemQuantities.get(i.id) || ''}' required/>
            `)
        }).join('')

        selectedItems.state = items
        itemMenu.classList.add('hidden')
    })

    //Load bundle quantities
    if (edit) {
        const bundle = bundleManager.read(id)
        const { itemManager } = stockManager

        //Save quantities
        bundle.items.forEach(i => {
            itemQuantities.set(i.id, i.quantity)
        })

        //Update checkboxes
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]')
        checkboxes.forEach(c => {c.checked = itemQuantities.get(c.id)})

        //Map and insert items
        const items = bundle.items.map(i => {
            const item = itemManager.read(i.id)

            return(`
                <span class='span-wrapper'> ${item.name}  </span>
                <span class='span-wrapper'> ${item.category} </span>
                <input type='number' min='1' id='${i.id}' value='${itemQuantities.get(i.id) || ''}' required/>
            `)
        }).join('')

        selectedItems.state = items
    }

    //Handle submit
    const form = modal.querySelector('form')

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const itemInputs = [...modal.querySelectorAll('input[type=number]')]
        if (itemInputs.length == 0) {
            window.eAPI.message(i18n.t('add-at-least-one-item'))
            return
        }

        const { name } = Object.fromEntries(new FormData(form))
        const items = itemInputs.map(i => ({id: i.id, quantity: i.valueAsNumber}))
        
        let success
        if (edit) {success = bundleManager.update(id, name, items)}
        else {success = bundleManager.create(name, items)}
        
        if (!success) {window.eAPI.message(i18n.t('something-went-wrong'))}
        closeModal()
    })

    //Handle search
    const itemSearchbar = modal.querySelector('.item-searchbar')
    const itemList = modal.querySelectorAll('.item-list *')

    itemSearchbar.addEventListener('input', () => {
        const search = itemSearchbar.value.toLowerCase()

        itemList.forEach(element => {
            if (element.classList.contains('column-header')) {return}

            const name = element.dataset.name.toLowerCase()
            element.classList.toggle('hidden', !name.includes(search))
        })
    })

    //Handle remove
    if (edit) {
        const removeButton = modal.querySelector('.remove')
        removeButton.addEventListener('click', () => {
            const confirm = window.eAPI.confirm(i18n.t('are-you-sure-bundle'))
            if (confirm) {bundleManager.delete(id)}
            closeModal()
        })
    }

    //Handle cancel
    const cancelButton = modal.querySelector('.cancel')
    cancelButton.addEventListener('click', () => {modal.close()})
    

    //Implement operations
    //Implement bundle items list

    modal.showModal()
}

const style = undefined

export const BundleModal = {
    display: display,
    setup: setup,
    style: style
}

