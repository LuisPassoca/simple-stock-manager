const display = () => {

    return(` 
        <div class='category'>
            <h2> Categoria X <i class="fa-solid fa-angle-up"></i> </h2>

            <div class='category-items'>
                <span> Nome </span>
                <span> Qtd. </span>
                <span> Operação </span>

                <span> Item 1 </span>
                <span> 0 un. </span> 
                <div class='item-operations'> 
                    <input type='number' />
                    <button> <i class="fa-solid fa-check"></i> </button>
                    <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>

                <span> Item 2 </span>
                <span> 0 un. </span> 
                <div class='item-operations'> 
                    <input type='number' />
                    <button> <i class="fa-solid fa-check"></i> </button>
                    <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>
            </div>
        </div>

        <div class='category'>
            <h2> Categoria Y <i class="fa-solid fa-angle-up"></i> </h2>

            <div class='category-items'>
                <span> Nome </span>
                <span> Qtd. </span>
                <span> Operação </span>

                <span> Item 1 </span>
                <span> 0 un. </span> 
                <div class='item-operations'> 
                    <input type='number' />
                    <button> <i class="fa-solid fa-check"></i> </button>
                    <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>

                <span> Item 1 </span>
                <span> 0 un. </span> 
                <div class='item-operations'> 
                    <input type='number' />
                    <button> <i class="fa-solid fa-check"></i> </button>
                    <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>

                <span> Item 1 </span>
                <span> 0 un. </span> 
                <div class='item-operations'> 
                    <input type='number' />
                    <button> <i class="fa-solid fa-check"></i> </button>
                    <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>

                <span> Item 1 </span>
                <span> 0 un. </span> 
                <div class='item-operations'> 
                    <input type='number' />
                    <button> <i class="fa-solid fa-check"></i> </button>
                    <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>

                <span> Item 1 </span>
                <span> 0 un. </span> 
                <div class='item-operations'> 
                    <input type='number' />
                    <button> <i class="fa-solid fa-check"></i> </button>
                    <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>

                <span> Item 1 </span>
                <span> 0 un. </span> 
                <div class='item-operations'> 
                    <input type='number' />
                    <button> <i class="fa-solid fa-check"></i> </button>
                    <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>

                <span> Item 1 </span>
                <span> 0 un. </span> 
                <div class='item-operations'> 
                    <input type='number' />
                    <button> <i class="fa-solid fa-check"></i> </button>
                    <button> <i class="fa-regular fa-pen-to-square"></i> </button>
                </div>
            </div>
        </div>

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

