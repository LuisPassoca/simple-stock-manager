//Stock Items 
const stock = new Map()

let nextItemId = 1
const createItemId = () => (`item-${nextItemId++}`)

function addItem({name, category, quantity = 0, notify = 0}) {
    if (!name) {return false}

    const id = createItemId()
    const item = {id, name, category, quantity, notify}

    stock.set(id, item)
    saveManager()
    return id
}

function removeItem(id) {
    for (const [setId, set] of sets) {
        set.items = set.items.filter(item => item.id != id)
    }

    stock.delete(id)
    saveManager()
}

function editItem(id, {name, category, quantity, notify}) {
    const item = stock.get(id)
    if (!item) {return false}

    item.name = name ?? item.name
    item.category = category ?? item.category
    item.quantity = quantity ?? item.quantity
    item.notify = notify ?? item.notify

    saveManager()
    return true
}

function readItem(id) {
    return stock.get(id)
}

//Stock sets
const sets = new Map()

let nextSetId = 1
const createSetId = () => (`set-${nextSetId++}`)

//set items length might be 0
function addSet(name, items) {
    if ((!name) || (!items)) {return false}

    const id = createSetId()
    const set = {id, name, items}

    sets.set(id, set)
    saveManager()
    return id
}

function removeSet(id) {
    sets.delete(id)
    saveManager()
}

function editSet(id, {name, items}) {
    const set = sets.get(id)
    if (!set) {return false}

    set.name = name ?? set.name
    set.items = items ?? set.items

    saveManager()
    return true
}

function readSetElement(id) {
    return sets.get(id)
}

function readSets() {
    return Array.from(sets, ([id, set]) => ({id, name: set.name, items: set.items}))
}

//Aditional functs
function checkAlerts() {
    const alerts = []

    for (const [id, {quantity, notify}] of stock) {
        if (quantity <= notify) {alerts.push(id)}
    }

    if (alerts.length == 0) {return false}
    return alerts
}

function readStock() {
    const stockObject = {}
    
    for (const [id, { name, category, quantity, notify }] of stock) {
        if (!stockObject[category]) {stockObject[category] = []}

        stockObject[category].push({id, name, quantity, notify})  
    }

    return Object.entries(stockObject).map(([category, items]) => ({category, items}))
}

function saveManager() {    
    const arrayStock = readStock()
    const stringStock = JSON.stringify(arrayStock)

    const arraySets = readSets()
    const stringSets = JSON.stringify(arraySets)

    localStorage.setItem('nextItemId', nextItemId.toString())
    localStorage.setItem('nextSetId', nextSetId.toString())
    localStorage.setItem('stock', stringStock)
    localStorage.setItem('sets', stringSets)
}

function loadManager() {
    const savedItemId = localStorage.getItem('nextItemId')
    if (savedItemId) {nextItemId = Number(savedItemId)}
    
    const savedSetId = localStorage.getItem('nextSetId')
    if (savedItemId) {nextSetId = Number(savedSetId)}
    
    const stringStock = localStorage.getItem('stock')
    if (stringStock) {
        const parsedStock = JSON.parse(stringStock)

        for (const {category, items} of parsedStock) {
            for (const item of items) {
                stock.set(item.id, {category, ...item})
            }
        }
    }

    const stringSets = localStorage.getItem('sets')
    if (stringSets) {
        const parsedSets = JSON.parse(stringSets)

        for (const set of parsedSets) {
            sets.set(set.id, {...set})
        }
    }
}

//localStorage.clear()
loadManager()

export const stockManager = {
    items: {
        add: addItem,
        remove: removeItem,
        edit: editItem,
        get: readItem
    },

    sets: {
        add: addSet, 
        remove: removeSet,
        edit: editSet, 
        get: readSetElement,
        getAll: readSets
    },
    get: readStock,
    alerts: checkAlerts,
    save: saveManager
}

