import { stockManager } from "../../scripts/stock-manager.js"

const display = () => {
    const stock = stockManager.read()

    return(` 

        ${stock.map(({category, items}) => (`
            <div class='category'>
                <h2> ${category} <i class="fa-solid fa-angle-up"></i> </h2>

                <div class='category-items'>
                    <span> Nome </span>
                    <span> Qtd. </span>
                    <span> Operação </span>

                    ${items.map(({id, name, quantity}) => (`
                        <span> ${name} </span>
                        <span> ${quantity} un. </span> 
                        <div class='item-operations' data-id='${id}'> 
                            <input type='number' />
                            <button> <i class="fa-solid fa-check"></i> </button>
                            <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                        </div>
                    `)).join('')}
                </div>
            </div>
        `)).join('')}

    `)
}

const setup = () => {
    const root = document.querySelector('.tab-display')
    
    const categories = root.querySelectorAll('.category')
    categories.forEach(c => {
        const header = c.querySelector('h2')
        const items = c.querySelector('.category-items')

        header.addEventListener('click', () => {
            items.style.display = (items.style.display == 'none' ? 'grid' : 'none')
            header.querySelector('i').classList.toggle('fa-angle-up')
            header.querySelector('i').classList.toggle('fa-angle-down')
        })
    })

}



const style = undefined

export const ItemList = {
    display: display,
    setup: setup,
    style: style
}

