const globalVariables = {}
export const global = {
    set: (name, value) => {globalVariables[name] = value},
    get: (name) => (globalVariables[name]),
    remove: (name) => {delete globalVariables[name]}
}