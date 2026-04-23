export function print(html, style = '') {
    if (!html) {throw new Error('Unable to print content, HTML was not provided.')}

    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)

    const content = iframe.contentWindow
    const doc = content.document
    doc.open()
    doc.write(`
        <html>
            <head>
                <style>
                    ${style}
                </style>
            </head>
            <body>
                ${html}
            </body>
        </html>
    `)
    doc.close()

    content.focus()
    content.print()

    iframe.remove()
}