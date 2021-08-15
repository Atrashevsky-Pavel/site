import { Modal } from 'bootstrap'
import { CATALOG_ROOT_SELECTOR } from './catalog/constants'

export default () =>
     document.addEventListener('DOMContentLoaded', () => {
          const modal = document.getElementById('modal-order')
          const form = modal.querySelector('form')

          new Modal(modal)

          document.addEventListener('click', event => {
               const element = event.target.closest('[data-modal-order-btn]')
               if (element) {
                    switch (element.dataset.modalOrderBtn) {
                         case 'order':
                              clickHandler(element, modal, form)
                              break;
                         case 'call':
                              callClickHandler(modal, form)
                              break;
                    }
               }
          })
     })

const clickHandler = (button, modal, form) => {
     const title = modal.querySelector('.modalOrder__title')
     title.textContent = 'Заказать'

     const card = button.closest('[data-id]')
     const cardInput = card.querySelector('input[name="product"]')

     if (form.querySelector('input[name="product"]')) form.removeChild(form.lastChild)
     form.appendChild(cardInput.cloneNode())

     Modal.getInstance(modal).show()
}

const callClickHandler = (modal, form) => {
     const title = modal.querySelector('.modalOrder__title')
     title.textContent = 'Заказать звонок'

     if (form.querySelector('input[name="product"]')) form.removeChild(form.lastChild)

     Modal.getInstance(modal).show()
}