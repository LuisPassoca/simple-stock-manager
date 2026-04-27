//Item handling
const stock = new Map()

let nextItemId = 1
const createItemId = () => (`i-${nextItemId++}`)

/*  
    Item format: {id: number, name: string, category: string, quantity: number, minimum: number}
*/

function createItem({name, category, quantity = 0, minimum = 0}) {
    if (!name || !category) {return false}

    const id = createItemId()
    const item = {id, name, category, quantity, minimum}

    stock.set(id, item)
    return id
}

function readItem(id) {
    return stock.get(id)
}

function updateItem(id, {name, category, quantity, minimum}) {
    const item = stock.get(id)
    if (!item) {return false}

    item.name = name ?? item.name
    item.category = category ?? item.category
    item.quantity = quantity ?? item.quantity
    item.minimum = minimum ?? item.minimum

    return true
}

function deleteItem(id) {
    //Remove item from bundles
    for (const [bundleId, bundle] of bundles) {
        bundle.items = bundle.items.filter(item => item.id != id)
    }

    stock.delete(id)
}

//Bundle handling
const bundles = new Map()

let nextBundleId = 1
const createBundleId = () => (`b-${nextBundleId++}`)

/*
    Bundle format: {id: number, name: string, items: [{id: number, quantity: number}]}
*/

function createBundle(name, items) {
    if (!name || !items) {return}

    const id = createBundleId()
    const bundle = {id, name, items}

    bundles.set(id, bundle)
    return id
}

function readBundleElement(id) {
    return bundles.get(id)
}

function readBundles() {
    return Array.from(bundles, ([id, bundle]) => ({id: bundle.id, name: bundle.name, items: bundle.items}))
}

function updateBundle(id, name, items) {
    const bundle = bundles.get(id)
    if (!bundle) {return false}

    bundle.name = name ?? bundle.name
    bundle.items = items ?? bundle.items

    return true
}

function deleteBundle(id) {
    bundles.delete(id)
}

//Aditional functions
function getAlerts() {
    const alerts = []

    for (const [id, { quantity, minimum }] of stock) {
        if (quantity <= minimum) {alerts.push(id)}
    }

    return alerts
}

function readStock() {
    const stockObject = {}

    for (const [id, { name, category, quantity, minimum }] of stock) {
        if (!stockObject[category]) {stockObject[category] = []}
        stockObject[category].push({ id, name, category, quantity, minimum })
    }

    return Object.entries(stockObject).map(([category, items]) => ({category, items}))
}

function save() {
    const stockArray = readStock()
    const stockString = JSON.stringify(stockArray)

    const bundleArray = readBundles()
    const bundleString = JSON.stringify(bundleArray)

    localStorage.setItem('nextItemId', nextItemId.toString())
    localStorage.setItem('nextBundleId', nextBundleId.toString())
    localStorage.setItem('stock', stockString)
    localStorage.setItem('bundles', bundleString)
}

function load() {
    const savedItemId = localStorage.getItem('nextItemId')
    if (savedItemId) {nextItemId = Number(savedItemId)}

    const savedBundleId = localStorage.getItem('nextBundleId')
    if (savedBundleId) {nextBundleId = Number(savedBundleId)}

    const stockString = localStorage.getItem('stock')
    if (stockString) {
        const parsedStock = JSON.parse(stockString)

        for (const { category, items } of parsedStock) {
            for (const item of items) {
                stock.set(item.id, item)
            }
        }
    }

    const bundleString = localStorage.getItem('bundles')
    if (bundleString) {
        const parsedBundles = JSON.parse(bundleString)

        for (const bundle of parsedBundles) {
            bundles.set(bundle.id, {...bundle})
        }
    }
}

//Load manager
load()

export const stockManager = {
    itemManager: {
        create: createItem,
        read: readItem,
        update: updateItem,
        delete: deleteItem
    },
    bundleManager: {
        create: createBundle,
        read: readBundleElement,
        update: updateBundle,
        delete: deleteBundle,
        readAll: readBundles
    },
    read: readStock,
    alerts: getAlerts,
    save: save
}

export class ItemOperationManager {
    operations = new Map()
    // operations = {{id, operation}}

    set(id, operation) {
        const item = stock.get(id)
        if (!item) {return false}

        if (operation == 0) {
            this.operations.delete(id)
            return false
        }

        const floor = item.quantity * (-1)
        if (operation < floor) {return false}

        this.operations.set(id, operation)
        return true
    }

    get(id) {
        return this.operations.get(id)
    }

    getAll() {
        // return [{id: 'item-1', operation: -10, result: 0}]
        return Array.from(this.operations)
            .map(([id, operation]) => {
                const item = stock.get(id)
                const result = item.quantity + operation
                return({ id, operation, result })
            }
        )
    }

    apply(id) {
        const item = stock.get(id)
        if (!item) {
            this.operations.delete(id)
            return false
        }

        const operation = this.operations.get(id)
        if (!operation) {return false}

        item.quantity += operation
        this.operations.delete(id)
        return true
    }

    applyAll() {
        for (const [key, value] of this.operations) {
            this.apply(key)
        }
    }

    pending() {
        for (const [key, value] of this.operations) {
            const item = stock.get(key)
            if (!item) {
                this.operations.delete(key)
                return false
            }
        }

        return (this.operations.size > 0)
    }
}