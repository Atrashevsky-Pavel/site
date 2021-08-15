import filter from './filter'
import render from './render'
import menu from './menu'
import modalInfo from './modalInfo'
import { CATALOG_FILTER_SELECTOR, CATALOG_ROOT_SELECTOR } from './constants'

export default () => {
     const root = document.querySelector(CATALOG_ROOT_SELECTOR)
     if (!root) return console.error('Catalog: Root not founded')

     const filterNode = document.querySelector(CATALOG_FILTER_SELECTOR)
     const catalogForm = document.querySelector('.catalog__menu')

     catalogForm.addEventListener('change', event => {
          changeHandler(event.target.value, filterNode, root)
     })

     changeHandler('samokat', filterNode, root)

     modalInfo()
     menu()
}

const changeHandler = (type, filterNode, root) => {
     switch (type) {
          case 'samokat':
               samokatRender(root, productData.samokatData, filterNode)
               break;
          case 'batut':
               batutRender(root, productData.batutData, filterNode)
               break;
     }
}

const samokatRender = (root, items, filterNode) => {
     filterNode.hidden = false
     render(root, items)
     filter(items, filteredItems => {
          render(root, filteredItems)
     })
}

const batutRender = (root, items, filterNode) => {
     filterNode.hidden = true
     render(root, items)
}