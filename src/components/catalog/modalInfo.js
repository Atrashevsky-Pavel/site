import { Modal } from 'bootstrap'
import {
     MODAL_INFO_CAROUSEL_INNER_SELECTOR,
     MODAL_INFO_DESCRIPTION_SELECTOR,
     MODAL_INFO_PRICE_OLD_SELECTOR,
     MODAL_INFO_PRICE_NEW_SELECTOR,
     MODAL_INFO_PROPERTIES_SELECTOR,
     MODAL_INFO_TAGS_SELECTOR,
     MODAL_INFO_TITLE_SELECTOR,
     MODAL_INFO_BTN_OPEN_SELECTOR,
     MODAL_INFO_SELECTOR,
     MODAL_INFO_PRODUCT_INPUT_SELECTOR,
     CATALOG_CARD_SELECTOR,
     CATALOG_ROOT_SELECTOR
} from './constants'

export default () =>
     document.addEventListener('DOMContentLoaded', () => {
          const modal = document.querySelector(MODAL_INFO_SELECTOR)
          const root = document.querySelector(CATALOG_ROOT_SELECTOR)
          if (!(modal instanceof Node)) return console.error('Catalog-Root: Invalid modal selector')
          if (!(root instanceof Node)) return console.error('Catalog-Root: Invalid root selector')
          new Modal(modal)

          root.addEventListener('click', event => {
               if (event.target.closest(MODAL_INFO_BTN_OPEN_SELECTOR)) {
                    event.preventDefault()
                    clickHandler(event.target, modal)
               }
          })
     })

const clickHandler = (button, modal) => {
     const productId = button.closest(CATALOG_CARD_SELECTOR).dataset.id
     const product = getProduct(productId)
     if (!product) return console.error('Modal Info: Invalid product id')

     const result = clearModal(modal)
     if (!result.isOk) return console.error(result.message)

     const setPromise = new Promise(resolve => {
          setDataInModal(product, modal)
          resolve()
     })

     setPromise.then(() => Modal.getInstance(modal).show())
}

const setDataInModal = (product, modal) => {
     setId(product, modal)
     setCarouselInner(product, modal)
     setTitle(product, modal)
     setPrices(product, modal)
     setTags(product, modal)
     setProperties(product, modal)
     setDescription(product, modal)
}

const setCarouselInner = (product, modal) => {
     const inner = modal.querySelector(MODAL_INFO_CAROUSEL_INNER_SELECTOR)
     if (product && product.images === undefined) return
     product.images.forEach(image => {
          const imageHTML = `<div class="modalInfo__carousel-item carousel-item">
               <img src="${image?.src}" alt="${image?.alt}">
          </div>
          `

          inner.insertAdjacentHTML('beforeend', imageHTML)
     })

     inner.firstChild.classList.add('active')
}

const setTitle = (product, modal) => {
     const title = modal.querySelector(MODAL_INFO_TITLE_SELECTOR)
     title.textContent = product.title || 'Название продукта'
}

const setPrices = (product, modal) => {
     const newPrice = modal.querySelector(MODAL_INFO_PRICE_NEW_SELECTOR)
     const oldPrice = modal.querySelector(MODAL_INFO_PRICE_OLD_SELECTOR)

     newPrice.textContent = product?.prices?.new || 0
     oldPrice.textContent = product?.prices?.old || 0
}

const setId = (product, modal) => {
     const input = modal.querySelector(MODAL_INFO_PRODUCT_INPUT_SELECTOR)

     const price = product?.prices?.new || '?'

     input.value = `${product.title || product.id}; Цена: ${price} р.`
}

const setTags = (product, modal) => {
     const tags = modal.querySelector(MODAL_INFO_TAGS_SELECTOR)

     product?.tags?.forEach(tag => tags.insertAdjacentHTML('beforeend', `<span>${tag}</span>`))
}

const setProperties = (product, modal) => {
     const properties = modal.querySelector(MODAL_INFO_PROPERTIES_SELECTOR)
     product?.properties?.forEach(property => {
          properties.insertAdjacentHTML('beforeend', `<li>${parseProperty(property)}</li>`)
     })

     function parseProperty(property) {
          return property.includes(':') ? `<b>${property.split(':')[0]}:</b>${property.split(':')[1]}` : `<b>${property}</b>`
     }
}

const setDescription = (product, modal) => {
     const description = modal.querySelector(MODAL_INFO_DESCRIPTION_SELECTOR)
     description.insertAdjacentHTML('beforeend', `${product.description || `<b>${product.title || 'Название продукта'}</b> - очень классный.`}`)
}

const clearModal = modal => {
     if (!(modal instanceof Node)) return {
          isOk: false,
          message: 'Modal Info: Invalid modal argument - type must be Node'
     };

     const id = modal.querySelector(MODAL_INFO_PRODUCT_INPUT_SELECTOR)
     if (!id) return {
          isOk: false,
          message: `Modal Info: Node with selector "${MODAL_INFO_PRODUCT_INPUT_SELECTOR}" not founded`
     }

     const nodes = {
          [MODAL_INFO_CAROUSEL_INNER_SELECTOR]: modal.querySelector(MODAL_INFO_CAROUSEL_INNER_SELECTOR),
          [MODAL_INFO_TITLE_SELECTOR]: modal.querySelector(MODAL_INFO_TITLE_SELECTOR),
          [MODAL_INFO_PRICE_NEW_SELECTOR]: modal.querySelector(MODAL_INFO_PRICE_NEW_SELECTOR),
          [MODAL_INFO_PRICE_OLD_SELECTOR]: modal.querySelector(MODAL_INFO_PRICE_OLD_SELECTOR),
          [MODAL_INFO_TAGS_SELECTOR]: modal.querySelector(MODAL_INFO_TAGS_SELECTOR),
          [MODAL_INFO_PROPERTIES_SELECTOR]: modal.querySelector(MODAL_INFO_PROPERTIES_SELECTOR),
          [MODAL_INFO_DESCRIPTION_SELECTOR]: modal.querySelector(MODAL_INFO_DESCRIPTION_SELECTOR),
     }

     for (let key in nodes) {
          if (nodes[key] instanceof Node) clearNode(nodes[key])
          else return {
               isOk: false,
               message: `Modal Info: Node with selector "${key}" not founded`
          }
     }

     return { isOk: true }
}

const clearNode = node => {
     while (node.firstChild) {
          node.removeChild(node.firstChild)
     }
}

const getProduct = (id) => {
     for (let key in productData) {
          for (let i = 0; i < productData[key].length; i++) {
               if (productData[key][i].id === id) {
                    return productData[key][i]
               }
          }
     }

     return null
}