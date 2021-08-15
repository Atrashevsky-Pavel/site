export default () =>
     document.addEventListener('DOMContentLoaded', () => {
          const form = document.getElementById('gifts-form')
          let state = {
               pricePlace: document.getElementById('gifts-price-number'),
               price: 0,
               checkboxes: form.querySelectorAll('input[type="checkbox"]'),
               indexes: []
          }

          if (!form) {
               return console.error('Gifts: Form not founded')
          }

          form.addEventListener('change', event => {
               state = changeHandler(event.target, state)
               render(state)
          })
     })

const changeHandler = (target, state) => {
     const indexes = getIndexes(state)
     const price = getNewPrice(indexes, state)
     if (price > 150) {
          return state
     }

     return {
          ...state,
          indexes,
          price
     }
}

const getIndexes = ({ checkboxes }) => {
     const indexes = Array.prototype.reduce.call(checkboxes, (indexes, checkbox) => {
          if (checkbox.checked) {
               indexes.push(Array.prototype.indexOf.call(checkboxes, checkbox))

               return indexes
          }

          return indexes
     }, [])

     return indexes
}

const getNewPrice = (indexes, { checkboxes }) =>
     indexes.reduce((result, index) =>
          result += +checkboxes[index].dataset.giftsPrice
          , 0)

const render = ({ pricePlace, price, checkboxes, indexes }) => {
     setPrice(pricePlace, price)
     setCheckboxesState(checkboxes, indexes, price)
}

const setPrice = (pricePlace, price) => pricePlace.textContent = price

const setCheckboxesState = (checkboxes, indexes, price) => {
     if (price >= 150) {
          Array.prototype.forEach.call(checkboxes, checkbox => {
               checkbox.disabled = indexes.indexOf(Array.prototype.indexOf.call(checkboxes, checkbox)) < 0
          })
     } else {
          Array.prototype.forEach.call(checkboxes, checkbox =>
               checkbox.disabled = false)
     }
}
