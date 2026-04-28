<div align='center'>
  <h1> Simple Stock Manager </h1> 
  <img width="128" height="auto" alt="icon" src="https://github.com/user-attachments/assets/9e7c8bc5-bfa4-4ba0-9487-e60323450458" />
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Electronjs-Desktop_App-blue">
  <img src="https://img.shields.io/badge/JavaScript-ESModules-yellow">
  <img src="https://img.shields.io/badge/Status-Active-success">
</p>

A simple desktop inventory management application built with Electronjs and JavaScript. Designed to simplify stock managing tasks, making it easy to organize items, categories and bundles through a clean visual interface.

### Navigation:
- [About the project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Scripts](#scripts)
- [Screenshots](#screenshots)

## About the project
Simple Stock Manager was originally developed as a real-world solution for a small business that needed a basic interface to handle inventory management. The project was later refactored and redesigned to improve code readability and overall user experience. Rather than relying too much on frameworks, the application was built entirely with JavaScript and custom script modules that handle inventory management, rendering, state changes, localization and printing functionalities. The goal here was to develop a simple yet efficient desktop application that allowed managing stock items through a simple interface.

## Features
- 📦 Create, edit and remove stock items
- 📁 Organize items by category
- 🧩 Create item bundles for easy operations
- ⚠️ Set item quantity thresholds and visualize alerts 
- 🖨️ Print a list of stock items, bundles and alerts 
- 🌐 Multi-language support (`en`, `pt-br`)

## Tech Stack
- Electronjs - Desktop application framework
- JavaScript - Core logic
- HTML / CSS - UI and styling

## Installation
> General release coming soon...

For local development:
1. Clone this repository:
   ```bash
   git clone https://github.com/LuisPassoca/simple-stock-manager.git simple-stock-manager
   cd simple-stock-manager
   ```
   
3. Install dependencies:
   ```bash
   npm install
   ```
   
4. Run the app:
   ```bash
   npm run start
   ```

## Scripts
For this project, I came up with a few scripts, which can all be found under `./src/scripts`. Here is the summarized explanation of them, aswell as some example usages:
- `stock-manager.js`: Core script of the application, allows you to create and manage items and bundles, aswell as handle operations with them.

  ```js
    import { stockManager } from './stock-manager.js'
    const { itemManager, bundleManager } = stockManager

    //Creating two items under the same category
    const item1 = itemManager.create({ name: 'Item 1', category: 'Category 1', quantity: 10, minimum: 5})
    const item2 = itemManager.create({ name: 'Item 2', category: 'Category 1', quantity: 10, minimum: 5})

    //Grouping the items into a bundle
    const bundle1 = bundleManager.create('Bundle 1', [{id: item1, quantity: 5}, {id: item2, quantity: 5}])
  ```

- `state-callback.js`: Allows you to create a variable with a trackable state, which triggers a callback. Pairs up nicely with `renderer.js` to allow for dynamic rerendering of the interface.

  ```js
    import { stateCallback } from './state-callback.js'

    //Creating a variable with a custom callback
    const variable = stateCallback(false, (current, previous) => {
      console.log(`Current value: ${current} | Previous value: ${previous}`)
    })

    //Changing the variable state, which retriggers the callback
    variable.state = true 
  ```

- `renderer.js`: Allows you to render a page/component from a file that contains compacted JS, HTML and a CSS file reference. This script pairs really well with `state-callback.js`, allowing for dynamic rerendering of UI components.

  ```js
    import { render } from './renderer.js'
    import { Page } from './pages/Page.js'

    //Getting the root with querySelector
    const root = document.querySelector('.root')
  
    //Setting up properties to be passed to the rendered page 
    const props = { hello: 'World!'}

    //Rendering the page on the specified root, with the given props
    render(Page, root, props)
  ```

  ```js
    //Renderer file format:
    const display = (props) => {
        //JS code to be executed before loading HTML
  
        //HTML code in template literal format
        return(` 
            <h1> Hello world! </h1>
        `)
    }
    
    const setup = (props) => {
      //JS code to be executed after loading HTML
    }

    //CSS file path
    const style = './styles/Page.css'

    //Export used to load the page using the render() function
    export const Page = {
        display: display,
        setup: setup,
        style: style
    }
  ```
  
- `global-variables.js`: Allows you to dynamically export global variables which can be accessed from any `.js` file.
  
  ```js
    import { global } from './global-variables.js'

    //Storing a global variable
    global.set('key', 'Hello World!')

    //Retrieving a global variable
    const variable = global.get('key')

    //Deleting a global variable
    global.remove('key')
  ```

- `i18n.js`: Allows for multi-language support. A `.json/.js` file provides a list of words/phrases with their respective translations.
  
  ```js
    import { i18n } from './i18n.js'

    //Sets the translation language
    i18n.locale = 'pt-br'

    //Retrieves the translation of a key
    i18n.t('hello') //Returns 'Olá'
  ```
- `print.js`: Allows for printing chunks of HTML. Creates a stylized iframe and prints its contents.

  ```js
    import { print } from './print.js'

    //Setting up HTML
    const html = `
      <h1 class='hello'> Hello World! </h1>
    `

    //Setting up CSS
    const style = `
      .hello {
        font-style: italic;
      }
    `
  
    //Calling the print function
    print(html, style)
  ```

## Screenshots
<div align='center'>
  <img width="600" height="auto" src="https://github.com/user-attachments/assets/0bbc2f5d-80ba-4bbf-88fe-17b991850fd8" />
  <img width="600" height="auto" src="https://github.com/user-attachments/assets/284a41a5-2aec-4616-a25b-3d47001a4598" />
  <img width="600" height="auto" src="https://github.com/user-attachments/assets/1715e74a-1f83-4eda-92e2-b7339e519afd" />
  <img width="600" height="auto" src="https://github.com/user-attachments/assets/9ef64b75-fabe-4a8d-b827-fe9e8f051f8e" />
  <img width="600" height="auto" src="https://github.com/user-attachments/assets/ce89f670-b49e-40ef-989c-2c7a4d88e124" />
</div>
