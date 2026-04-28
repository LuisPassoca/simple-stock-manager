import { global } from "../../scripts/global-variables.js"
import { i18n } from "../../scripts/i18n.js"
import { stockManager } from "../../scripts/stock-manager.js"
import { BundleModal } from "./bundle-modal.js"

const display = ({ search, operationManager }) => {
    const { bundleManager } = stockManager
    const { itemManager } = stockManager
    const bundles = bundleManager.readAll()
    bundles.sort((a, b) => a.name.localeCompare(b.category, undefined, {numeric: true}))

    const display = bundles.map(b => {
        const lname = b.name.toLowerCase()
        const lsearch = search.toLowerCase()
        if (!lname.includes(lsearch)) {return}

        const items = b.items.map(i => {
            const item = itemManager.read(i.id)

            return(`
                <span class='highlight-span' title='${item.name}'> ${item.name} </span>
                <span class='highlight-span' title='${item.category}'> ${item.category} </span>
                <span class='item-quantity'> ${i.quantity} un. </span>
            `)
        }).join('')

        return(`
            <div class='bundle'>
                <div class='bundle-header'>
                    <h3 title='${b.name}'> 
                        <span> ${b.name} </span>
                        <i class="fa-solid fa-angle-down"></i> 
                    </h3>

                    <div class='bundle-operations' id='${b.id}'>
                        <input type='number' value='${operationManager?.get(b.id)}' placeholder='0' />
                        <button class='apply'> <i class="fa-solid fa-check"></i> </button>
                        <button class='edit'> <i class="fa-regular fa-pen-to-square"></i> </button>
                    </div>
                </div>

                <div class='bundle-items'>
                    <span> ${i18n.t('name')} </span>
                    <span> ${i18n.t('category')} </span>
                    <span> ${i18n.t('quantity')} </span>

                    ${items}
                </div>
            </div>
        `)
    }).join('')

    return (`
        <div class='bundle-column-header'>
            <h3> ${i18n.t('name')} </h3>
            <h3> ${i18n.t('operations')} </h3>
        </div>

        ${display}
    `)
}

const setup = ({ operationManager }) => {
    const root = document.querySelector('.tab-display')
    const { itemManager } = stockManager

    //Setup dropdown lists
    const bundles = root.querySelectorAll('.bundle')
    bundles.forEach(b => {
       const header = b.querySelector('h3')
       const items = b.querySelector('.bundle-items')
       
       items.style.display = 'none'
       header.addEventListener('click', () => {
            items.style.display = (items.style.display == 'none' ? 'grid' : 'none')
            header.querySelector('i').classList.toggle('fa-angle-up')
            header.querySelector('i').classList.toggle('fa-angle-down')
        })
    })

    //Setup operations
    const bundleOperations = root.querySelectorAll('.bundle-operations')
    bundleOperations.forEach(o => {
        const id = o.id
        const editbutton = o.querySelector('.edit')
        const applyButton = o.querySelector('.apply')
        const operationInput = o.querySelector('input')

        editbutton.addEventListener('click', () => {
            global.get('render/modal-display').state = { page: BundleModal, props: {edit: true, id} }
        })

        operationInput.addEventListener('input', () => {
            operationManager.set(id, operationInput.valueAsNumber)
        })

        applyButton.addEventListener('click', () => {
            const result = operationManager.apply(id)
            if (result !== true) {
                const invalidItems = result.map(i => {
                    const item = itemManager.read(i.id)
                    return(`${i18n.t('category')}: ${item.category} > ${i18n.t('item')}: ${item.name} > ${i18n.t('necessary')}: ${i.required} > ${i18n.t('available')}: ${item.quantity}`)
                }).join('\n\n')

                window.eAPI.message(`${i18n.t('error-insufficient')}:\n\n${invalidItems}`)

                return
            }

            window.eAPI.message(i18n.t('success-bundle-items'))
            global.get('render/bundle-list').reload()
            global.get('render/alerts-display').reload()
        })
    })
    

}

const style = undefined

export const BundleList = {
    display: display,
    setup: setup,
    style: style
}

