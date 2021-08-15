const render = (root, items) => {
     if (!(root instanceof Node)) return console.error('Catalog-root: root should be Node')
     if (!(items instanceof Array)) return console.error('Catalog-root: items should be Array')

     const message = document.createElement('h1')
     message.classList.add('catalog__message')
     message.textContent = 'Загрузка...'

     root.appendChild(message)
     clearRoot(root)
     root.hidden = true

     if (items.length === 0) {
          message.textContent = 'Не удалось найти товары'
          root.appendChild(message)
          root.hidden = false
          return
     }

     const renderPromise = new Promise(resolve => {
          items.forEach(item => {
               const result = getItemHTML(item)
               result && root.insertAdjacentHTML('beforeend', getItemHTML(item))
          })

          resolve()
     })

     renderPromise.then(() => {
          root.hidden = false
     })
}

const getItemHTML = item => {
     if (!item.id) return console.error('Catalog: item missing ID')

     const itemHTML = `
     <div class="col-xl-4 col-md-6 col-sm-10 col-11 mb-5">
     <article data-id="${item.id}" class="maincard">
          <input type="hidden" name="product" value="Продукт: ${item.title || item.id}; Цена: ${item?.prices?.new || '?'}">
          <header class="maincard__header">
               ${getStickerHTML(item)}
               ${getTitleHTML(item)}
               ${getImagesHTML(item)}
          </header>
          <div class="maincard__body">
               ${getShortPropertiesHTML(item)}
          </div>
          <footer class="maincard__footer">
               ${getPricesHTML(item)}
               <div class="maincard__footer-btns">
                    <button data-modal-info-btn type="button" class="app-btn app-btn-black app-btn-block mb-3">Подробнее</button>
                    <button data-modal-order-btn="order" type="button" class="app-btn app-btn-orange app-btn-block">Заказать</button>
               </div>
          </footer>
     </article>
     </div>
     `

     return itemHTML
}

const getStickerHTML = item => {

     return item.sticker ?
          `<span class="maincard__header-sticker">${item.sticker}</span>` : ''
}

const getTitleHTML = item => {
     const title = item.title || 'Название продукта'

     return `<h3 class="maincard__header-title">${title}</h3>`
}

const getImagesHTML = item => {
     if (!item.images) return ''
     if (!(item.images instanceof Array)) {
          console.error(`Catalog: Item with ID "${item.id}" has invalid images property - type must be Array`)
          return ''
     }

     if (item.images.length >= 2) {
          if (imageIsValid(item.images[0]) && imageIsValid(item.images[1])) {
               return `
               <div data-modal-info-btn class="maincard__header-images">
                    <img src="${item.images[0].src}" alt="${item.images[0].alt || ''}">
                    <img src="${item.images[1].src}" alt="${item.images[1].alt || ''}">
               </div>
               `
          } else return ''
     } else if (item.images.length === 1) {
          if (imageIsValid(item.images[0])) {
               return `
               <div data-modal-info-btn class="maincard__header-images">
                    <img src="${item.images[0].src}" alt="${item.images[0].alt || ''}">
               </div>
               `
          } else return ''
     } else return ''

     function imageIsValid(image) {
          if (!image.src) {
               console.error(`Catalog: Item with ID "${item.id}" missing SRC attribute in image property`)

               return false
          }

          return true
     }
}

const getShortPropertiesHTML = item => {
     if (!item.shortProperties) return ''
     if (!(item.shortProperties instanceof Array)) {
          console.error(`Catalog: Item with ID "${item.id}" has invalid shortProperties property - type must be Array`)
          return ''
     }

     const shortProperties = document.createElement('ul')
     shortProperties.classList.add('maincard__body-properties')

     item.shortProperties.forEach(prop => {
          let propContent = prop.includes(':') ? `<b>${prop.split(':')[0]}:</b>${prop.split(':')[1]}` : `<b>${prop}</b>`

          shortProperties.insertAdjacentHTML('beforeend', `<li>${propContent}</li>`)
     })

     return shortProperties.outerHTML
}

const getPricesHTML = item => {
     if (!item.prices) return ''
     let pricesContent = ''
     if (item.prices instanceof Object) {
          if (!item.prices.new) {
               console.error(`Catalog: Item with ID "${item.id}" has invalid prices property - missing property "new"`)

               return ''
          }

          pricesContent = `
          <div class="maincard__prices-new">
               <span data-maincard-price-new>${item.prices.new}</span> руб.
          </div>
          `

          if (item.prices.old) pricesContent = `
          <div class="maincard__prices-old">
               <span data-maincard-price-old>${item.prices.old}</span> руб.
          </div>
          ` + pricesContent
     } else if (typeof item.prices === 'number') {
          pricesContent = `
          <div class="maincard__prices-new">
               <span data-maincard-price-new>${item.prices}</span> руб.
          </div>
     `
     } else {
          console.error(`Catalog: Item with ID "${item.id}" has invalid prices property - type must be Object or Number`)
          return ''
     }

     return `<div class="maincard__prices">${pricesContent}</div>`
}

const clearRoot = root => {
     if (!(root instanceof Node)) return console.error('Catalog-Render: Invalid root type - must be Node')

     while (root.firstChild) {
          root.removeChild(root.firstChild)
     }
}

export default render