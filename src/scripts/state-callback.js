export function stateCallback(initial, callback) {
    let state = initial
    callback(state, undefined)

    return({
        get state() {return state},
        set state(v) {
            const prev = state
            state = v
            callback(state, prev)
        },
        reload: () => callback(state, state)
    })
}