export default () =>
     document.addEventListener('DOMContentLoaded', () => {
          const menu = document.querySelector('.catalog__menu')
          const foldBtn = menu.querySelector('.catalog__menu-menu')
          const menuItems = menu.querySelectorAll('label')

          Array.prototype.forEach.call(menuItems, item =>
               item.addEventListener('click', () => {
                    menu.classList.remove('active')
               }))

          foldBtn.addEventListener('click', () => {
               menu.classList.toggle('active')
          })
     })