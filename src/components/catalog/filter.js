import {
     CATALOG_FILTER_BTN_RESET_SELECTOR,
     CATALOG_FILTER_SELECTOR
} from './constants'

const filter = (initialItems = [], callback = f => f) => {
     const filter = document.querySelector(CATALOG_FILTER_SELECTOR)
     const selects = filter.querySelectorAll('select')
     if (!selects) return

     const resetButton = filter.querySelector(CATALOG_FILTER_BTN_RESET_SELECTOR)

     let filters = {}
     const items = initialItems

     resetButton.addEventListener('click', () => {
          callback(items)
          Array.prototype.forEach.call(selects, select => {
               select.value = select.options[0].value
               filters = {}
          })
     })

     Array.prototype.forEach.call(selects, select =>
          select.addEventListener('change', event => {
               filters = changeHandler(event.target, filters)
               let filteredItems = items
               for (let key in filters) {
                    filteredItems = filters[key](filteredItems)
               }

               callback(filteredItems)
          }))
}

const changeHandler = (select, filters) => {
     switch (select.name) {
          case 'price':
               filters = { ...filters, priceFilter: getPriceFilter(select.value) }
               break;
          case 'sitting':
               filters = { ...filters, sittingFilter: getSittingFilter(select.value) }
               break;
          case 'age':
               filters = { ...filters, ageFilter: getAgeFilter(select.value) }
               break;
          case 'mileage':
               filters = { ...filters, mileageFilter: getMileageFilter(select.value) }
               break;
          default:
               return
     }

     return filters
}

const getPriceFilter = (value) => (items) => {
     if (value === 'default') return items
     const limits = value.split('|')
     const minPrice = Number(limits[0])
     const maxPrice = Number(limits[1])
     if (minPrice >= 0 && maxPrice && minPrice < maxPrice) {
          const result = items.filter(item => item?.prices?.new >= minPrice && item?.prices?.new <= maxPrice)

          return result
     }

     return items
}
const getSittingFilter = (value) => (items) => {
     switch (value) {
          case 'default': return items
          case 'yes': return items.filter(item => item?.sitting)
          case 'no': return items.filter(item => !item?.sitting)
          default: return items
     }
}
const getAgeFilter = (value) => (items) => {
     switch (value) {
          case 'default': return items
          case 'child': return items.filter(item => item?.age === 'child' || item?.age === 'all')
          case 'adult': return items.filter(item => item?.age === 'adult' || item?.age === 'all')
          default: return items
     }
}

const getMileageFilter = (value) => (items) => {
     if (value === 'default') return items
     return items.filter(item => item?.mileage >= Number(value))
}

export default filter