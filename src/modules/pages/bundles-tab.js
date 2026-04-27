import { global } from "../../scripts/global-variables.js"
import { i18n } from "../../scripts/i18n.js"
import { render } from "../../scripts/renderer.js"
import { stateCallback } from "../../scripts/state-callback.js"
import { BundleOperationManager, stockManager } from "../../scripts/stock-manager.js"
import { BundleList } from "../components/bundle-list.js"
import { BundleModal } from "../components/bundle-modal.js"

const display = () => {

    return(` 
        <div class='flex-row'>
            <div class='search-bar-wrapper'>
                <input type='text' class='search-bar' placeholder='${i18n.t('search-for-a-bundle')}...' />
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <button class='add-bundle'> ${i18n.t('add-bundle')} </button>
        </div>

        <div class='bundle-list'></div>
    `)
}

const setup = () => {
    const root = document.querySelector('.tab-display')
    const searchBar = root.querySelector('.search-bar')
    const addBundleButton = root.querySelector('.add-bundle')
    const bundleListDiv = root.querySelector('.bundle-list')

    global.set('functions/operation-manager', null)

    //Setup add button
    addBundleButton.addEventListener('click', () => {
        global.get('render/modal-display').state = { page: BundleModal }
    })

    //Setup item operations
    const operationManager = new BundleOperationManager()
    global.set('functions/operation-manager', operationManager)

    //Setup bundle list & handle search
    const renderBundleList = stateCallback(null, () => {
        const search = searchBar.value

        render(BundleList, bundleListDiv, { search, operationManager })
    })

    global.set('render/bundle-list', renderBundleList)

    searchBar.addEventListener('input', () => {
        renderBundleList.reload()
    })

    //Setup printing
    global.set('functions/print', () => {
        const { itemManager, bundleManager } = stockManager
        const bundles = bundleManager.readAll()

        const content = bundles.map(b => {
            const items = b.items.map(i => {
                const item = itemManager.read(i.id)

                return(`
                    <span> ${item.name} </span>
                    <span> ${item.category} </span>
                    <span> ${item.quantity} </span>
                `)
            }).join('')
            
            return(`
                <div class='bundle'>
                    <h2> ${b.name} </h2>

                    <div class='items'>
                        <span> ${i18n.t('name')} </span>
                        <span> ${i18n.t('category')} </span>
                        <span> ${i18n.t('qtt')} </span>

                        ${items}
                    </div>
                </div>
            `)
        }).join('')

        const style = `
            .bundle {
                display: flex;
                flex-direction: column;
                gap: 10px;

                width: 800px;
                min-width: 0;

                h2 {
                    font-size: 32px;
                    overflow-wrap: break-word;
                }
                
                .items {
                    display: grid;
                    grid-template-columns: 1fr 150px max-content;
                    gap: 10px 20px;

                    span {
                        font-size: 24px;
                        border-bottom: rgba(0, 0, 0, 0.35) solid 1px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        `

        return {content, style}
    })
}

const style = "./modules/pages/styles/bundles-tab.css"

export const BundlesTab = {
    display: display,
    setup: setup,
    style: style
}

