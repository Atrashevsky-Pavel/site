export default () =>
     document.addEventListener('DOMContentLoaded', () => {
          const burger = document.querySelector('.burger')
          const target = document.getElementById(burger.dataset.burgerTarget)
          if (!target) {
               return console.error('Burger: Invalid target id')
          }
          const links = target.querySelectorAll('a')

          Array.prototype.forEach.call(links, link =>
               link.addEventListener('click', () => {
                    linkClickHandler(target, burger)
               }))

          burger.addEventListener('click', () => {
               btnClickHandler(burger)
               listClickHandler(target)
          })
     })

const btnClickHandler = (burger) => {
     burger.classList.toggle('opened')
}

const listClickHandler = (list) => {
     list.classList.toggle('opened')
}

const linkClickHandler = (list, burger) => {
     list.classList.remove('opened')
     burger.classList.remove('opened')
}