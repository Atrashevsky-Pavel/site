export default () =>
     document.addEventListener("DOMContentLoaded", () => {
          const header = document.getElementById('header')
          const headerHeight = header.clientHeight
          const links = document.querySelectorAll('[data-scroll-link]')

          Array.prototype.forEach.call(links, link =>
               link.addEventListener('click', event => {
                    event.preventDefault()
                    clickHandler(event.target, headerHeight)
               }))
     })

const clickHandler = (link, headerHeight) => {
     const targetSelector = link?.closest('[data-scroll-link]').dataset.scrollLink
     const target = document.querySelector(targetSelector)
     if (!target) return

     window.scrollTo(0, target.offsetTop - headerHeight + 7)
}