export async function render(page, root = document.querySelector('#root'), props = {}) {
    if (!page) {return}
    
    root.innerHTML = ''

    if (page.style) {
        await loadCSS(page.style, root)
    }

    const display = page.display(props)
    const node = toNode(display)
    root.append(node)
    
    page.setup(props)
}

function toNode(display) {
    const node = document.createElement('template')
    node.innerHTML = display

    return node.content
}

function loadCSS(href, root) {
    return new Promise((resolve) => {
        const css = document.createElement('link')
        css.rel = 'stylesheet'
        css.href = href

        root.appendChild(css)
        css.onload = resolve
    })
}

