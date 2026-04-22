function toNode(display) {
    const node = document.createElement('template');
    node.innerHTML = display;

    return node.content;
}

function loadCSS(href, root) {
    return new Promise((resolve) => {
        const css = document.createElement('link')
        css.rel = 'stylesheet'
        css.href = href

        css.onload = resolve
        root.appendChild(css)
    })
}

export async function render(page, root = document.querySelector('#root'), props) {
    root.innerHTML = '';

    if (page.style != undefined) {
        await loadCSS(page.style, root)
    }

    const display = page.display(props);
    const node = toNode(display);
    root.append(node);
    
    page.setup(props);
}

export function stateRender(initial, callback) {
    let value = initial;
    callback(value);

    return {
        get value() {return value},
        set value(v) {
            value = v;
            callback(value);
        },
        update: callback
    }
}

const globalVariables = {}
export const global = {
    set: (name, value) => {globalVariables[name] = value},
    get: (name) => (globalVariables[name]),
    remove: (name) => {delete globalVariables[name]}
}
