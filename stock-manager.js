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


export class ItemOperationsManager {
    items = new Map()

    set(id, operation) {
        if (operation == 0) {
            this.items.delete(id)
            return false
        }

        if (!this.verify(id, operation)) {return false}

        this.items.set(id, operation)
        return true
    }

    get(id) {
        return this.items.get(id)
    }

    verify(id, operation) {
        const item = stock.get(id)
        if (!item) {
            this.delete(id)
            return false
        }

        const floor = item.quantity * (-1)
        if (operation < floor) {
            this.delete(id)
            return false
        }
        return true
    }

    apply(id) {
        const operation = this.items.get(id)
        if (!operation) {return}

        const item = stock.get(id)
        if (!item) {
            this.delete(id)
            return
        }
        item.quantity += operation

        this.items.delete(id)
        saveManager()
    }

    applyAll() {
        for (const [key] of this.items) {
            this.apply(key)
        }
        saveManager()
    }

    delete(id) {
        this.items.delete(id)
    }

    read() {
        return Array.from(this.items, ([key, value]) => {
            const item = stock.get(key)
            const result = item.quantity + value
            return({id: key, operation: value, result})
        })
    }

    pending() {
        for (const [key, value] of this.items) {
            this.verify(key, value)
        }

        if (this.items.size > 0) {return true}
        return false
    }

    clear() {
        this.items.clear()
    }
}

export class SetOperationsManager {
    sets = new Map()

    set(id, operation) {
        if (operation == 0) {
            this.sets.delete(id)
            return true
        }

        //if (!this.verify(id, operation)) {return false}
        
        this.sets.set(id, operation)
        return true
    }

    get(id) {
        return this.sets.get(id)
    }

    verify(id, operation) {
        const invalidItems = []
        const set = sets.get(id)
        if (!set) {
            this.sets.delete(id)
            return false
        }

        for (const item of set.items) {
            const stockItem = stock.get(item.id)
            const needed = item.quantity * operation
            const result = stockItem.quantity - needed

            if (result < 0) {invalidItems.push({id: item.id, name: stockItem.name, stock: stockItem.quantity, needed})}
        }

        if (invalidItems.length == 0) {return true}
        else {return invalidItems}
    }

    /*
    verify(id, operation) {
        const set = sets.get(id)
        if (!set) {
            this.sets.delete(id)
            return false
        }

        for (const item of set.items) {
            const stockItem = stock.get(item.id)
            const result = stockItem.quantity - (item.quantity * operation)

            if (result < 0) {return false}
        }

        return true
    }
    */

    apply(id) {
        const set = sets.get(id)
        const operation = this.sets.get(id)
        if ((!set) || (!operation)) {return false}
        //added later
        const verification = this.verify(id, operation)
        if (verification !== true) {return verification}
        //

        for (const item of set.items) {
            const stockItem = stock.get(item.id)
            stockItem.quantity -= (item.quantity * operation)
        }

        this.sets.delete(id)
        saveManager()
        return true
    }

    verifyAll() {
        const items = new Map()
        const invalidItems = []

        for (const [key, value] of this.sets) {
            const set = sets.get(key)
            const operation = this.sets.get(key)
            
            for (const item of set.items) {
                if (!items.has(item.id)) {items.set(item.id, {operations: [], needed: 0})}
                const itemMap = items.get(item.id)
                itemMap.operations.push({id: set.id, quantity: (item.quantity * operation)})
                itemMap.needed += (item.quantity * operation)
            }
        }

        for (const [key, value] of items) {
            const item = stock.get(key)

            if (item.quantity < value.needed) {
                const sets = value.operations.map(operation => operation.id)

                invalidItems.push({id: item.id, stock: item.quantity, needed: value.needed, sets})
            }
        }

        if (invalidItems.length == 0) {return {type: 'valid', items: Array.from(items, ([key, value]) => ({id: key, quantity: value.needed}))}}
        else {return {type: 'invalid', invalidItems}}
    }

    applyAll() {
        const validity = this.verifyAll()
        if (validity.type == 'invalid') {return validity.invalidItems}

        const items = validity.items
        for (const item of items) {
            const stockItem = stock.get(item.id)
            stockItem.quantity -= item.quantity
        }

        this.sets.clear()
        saveManager()
        return true
    }

    read() {
        return Array.from(this.sets, ([key, value]) => ({id: key, quantity: value}))
    }

    pending() {
        if (this.sets.size == 0) {return false}
        else {return true}
    }

    clear() {
        this.sets.clear()
    }
}
