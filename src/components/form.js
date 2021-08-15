import { Modal } from 'bootstrap'

export default () =>
     document.addEventListener("DOMContentLoaded", () => {
          const forms = document.querySelectorAll('form')
          Array.prototype.forEach.call(forms, form => {
               form.addEventListener('submit', event => {
                    event.preventDefault()
                    submitHandler(event.target)
               })
          })
     })

const submitHandler = form => {
     if (typeof sessionStorage !== 'undefined') {
          if (sessionStorage.getItem('formSubmitted')) {
               if (!confirm('Вы уже отправили заявку, повторить?')) { return false }
          } else {
               sessionStorage.setItem('formSubmitted', 'true')
          }
     }

     closeModalIfExist(form)

     const data = []
     Array.prototype.forEach.call(form.elements, element => {
          if (element.name) {
               data.push({
                    name: element.name,
                    value: element.value
               })
          }
     })

     data.push({
          name: "source",
          value: "Test"
     })
     data.push({
          name: "title",
          value: "Test message"
     })
     data.push({
          name: "link",
          value: location.href
     })

     form.reset()

     console.log(JSON.stringify(data))
     return false

     $.ajax({
          type: "POST",
          url: "",
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          dataType: "json",
          data: data,
     }).done(function (response) {
          alert(response.text);
     }).fail(function (error, textStatus) {
          console.log(error, textStatus);
          alert('Извините, произошла ошибка запроса. Свяжитесь с менеджером по телефону!');
     });

     // Event dispatcher for IE9+ included
     if (typeof (Event) === 'function') {
          document.dispatchEvent(new Event('app.form.send'));
     } else {
          var ev = document.createEvent('Event');
          ev.initEvent('app.form.send', false, false);
          document.dispatchEvent(ev);
     }

     //console.log(JSON.stringify(data))
     return false
}

const closeModalIfExist = form => {
     const modal = form.closest('.modal')
     if (modal) {
          Modal.getInstance(modal).hide()
     }
}
