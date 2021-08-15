import {
     MODAL_TEST_BUTTONS_SELECTOR,
     MODAL_TEST_FORM_SELECTOR,
     MODAL_TEST_GOTO_NEXT_EVENT,
     MODAL_TEST_GOTO_PREV_EVENT,
     MODAL_TEST_NEXT_BUTTON_SELECTOR,
     MODAL_TEST_PREV_BUTTON_SELECTOR,
     MODAL_TEST_PROGRESS_SELECTOR,
     MODAL_TEST_QUESTION_NUMBER_SELECTOR,
     MODAL_TEST_SELECTOR,
     MODAL_TEST_STEPS_CIRCLES_SELECTOR,
     MODAL_TEST_STEPS_CURRENT_SELECTOR,
     MODAL_TEST_STEPS_TOTAL_SELECTOR,
     MODAL_TEST_TEST_SELECTOR
} from './constants'
import renderQuestion from './questionRender'
import validateQuestions from './questionsValidator'

export default () =>
     document.addEventListener('DOMContentLoaded', () => {
          let questions
          try { questions = questionsData } catch (e) { questions = null }
          const result = validateQuestions(questions)
          if (!result.isOk) return console.error(`ModalTest: ${result.message}`)

          const modal = document.querySelector(MODAL_TEST_SELECTOR)
          const root = document.querySelector(MODAL_TEST_TEST_SELECTOR)
          const btnNext = modal.querySelector(MODAL_TEST_NEXT_BUTTON_SELECTOR)
          const btnPrev = modal.querySelector(MODAL_TEST_PREV_BUTTON_SELECTOR)
          const btns = modal.querySelector(MODAL_TEST_BUTTONS_SELECTOR)
          const form = modal.querySelector(MODAL_TEST_FORM_SELECTOR)

          const questionsNodes = createQuestionsNodes(questions)

          let step = 1
          const totalSteps = questions.length + 1

          initSteps(modal, totalSteps)


          document.addEventListener(MODAL_TEST_GOTO_PREV_EVENT, event => {
               step = event.detail

               if (step === 1) {
                    btnPrev.disabled = true
               }

               renderQuestion(root, questionsNodes[step - 1])
          })
          document.addEventListener(MODAL_TEST_GOTO_NEXT_EVENT, event => {
               step = event.detail

               if (step < totalSteps) {
                    renderQuestion(root, questionsNodes[step - 1])
                    btnPrev.disabled = false
               } else {
                    form.hidden = false
                    root.hidden = true
                    btns.hidden = true

                    Array.prototype.forEach.call(questionsNodes, (node, index) => {
                         const nodeInputs = node.querySelectorAll('input')
                         let clientAnswer
                         Array.prototype.forEach.call(nodeInputs, input => {
                              if (input.checked) clientAnswer = input.value
                         })

                         const answerInput = document.createElement('input')
                         answerInput.type = 'hidden'
                         answerInput.value = `${questions[index].question}: ${clientAnswer}`
                         answerInput.name = `Ответ на вопрос №${index + 1}`

                         form.appendChild(answerInput)
                    })
               }
          })

          btnNext.addEventListener('click', () => nextBtnClickHandler(step, totalSteps, root))

          btnPrev.addEventListener('click', () => prevBtnClickHandler(step))

          renderQuestion(root, questionsNodes[0])
     })

const createQuestionsNodes = (questions) => questions.map((question, index) => createQuestionNode(question, index))

const createQuestionNode = (question, index) => {
     const questionWrapper = document.createElement('div')
     const questionHeaderHTML = getQuestionHeaderHTML(question, index)
     const questionBodyHTML = getQuestionBodyHTML(question, index)

     questionWrapper.innerHTML = questionHeaderHTML + questionBodyHTML

     return questionWrapper
}

const getQuestionHeaderHTML = (question, index) => {
     return `
          <header class="modalTest__test-header">
               <span class="modalTest__test-number">${index + 1}</span>
               <h4 class="modalTest__test-question">${question.question}</h4>
          </header>
     `
}

const getQuestionBodyHTML = (question, index) => {
     const questionBody = document.createElement('div')
     questionBody.classList.add('modalTest__test-answers')

     question.answers.forEach((answer, answerIndex) => {
          const answerHTML = `
          <div class="modalTest__test-answer">
               <input id="question-${index + 1}-answer-${answerIndex + 1}" type="radio" name="test-question-${index + 1}" value="${answer.text}">
               <label for="question-${index + 1}-answer-${answerIndex + 1}">
                    ${answer.img ? `<img src="${answer.img}" alt="">` : ''}
                    <div>
                         <span>Checkbox</span>
                         ${answer.text}
                    </div>
               </label>
          </div>
          `

          questionBody.insertAdjacentHTML('beforeend', answerHTML)
     })

     return questionBody.outerHTML
}

const initSteps = (modal, totalSteps) => {
     const progressPlace = modal.querySelector(MODAL_TEST_PROGRESS_SELECTOR)
     const currentStepPlace = modal.querySelector(MODAL_TEST_STEPS_CURRENT_SELECTOR)
     const totalStepsPlace = modal.querySelector(MODAL_TEST_STEPS_TOTAL_SELECTOR)
     const circlesPlace = modal.querySelector(MODAL_TEST_STEPS_CIRCLES_SELECTOR)
     const formNumberPlace = modal.querySelector('form').querySelector(MODAL_TEST_QUESTION_NUMBER_SELECTOR)

     progressPlace.style.width = `${100 / (totalSteps)}%`
     currentStepPlace.textContent = 1
     totalStepsPlace.textContent = totalSteps
     formNumberPlace.textContent = totalSteps

     for (let i = 0; i < totalSteps; i++) {
          const circle = document.createElement('div')
          circle.classList.add('modalTest__steps-circle')
          circlesPlace.appendChild(circle)
     }

     circlesPlace.firstChild.classList.add('passed')

     const config = {
          progress: progressPlace,
          current: currentStepPlace,
          total: totalStepsPlace,
          totalSteps,
          circles: circlesPlace
     }

     document.addEventListener(MODAL_TEST_GOTO_NEXT_EVENT, event => updateSteps({ ...config, step: event.detail }))
     document.addEventListener(MODAL_TEST_GOTO_PREV_EVENT, event => updateSteps({ ...config, step: event.detail }))
}

const updateSteps = (config) => {
     config.progress.style.width = `${100 / config.totalSteps * config.step}%`
     config.current.textContent = config.step
     config.total.textContent = config.totalSteps

     const circles = config.circles.childNodes

     for (let i = 0; i < config.totalSteps; i++) {
          if (i < config.step) {
               circles[i].classList.add('passed')
          } else {
               circles[i].classList.remove('passed')
          }
     }
}

const nextBtnClickHandler = (step, totalSteps, root) => {
     const radios = root.querySelectorAll('input')
     for (let i = 0; i < radios.length; i++) {
          if (radios[i].checked) break

          if (i === radios.length - 1) return alert('Выберите вариант ответа.')
     }

     if (step < totalSteps) {
          document.dispatchEvent(new CustomEvent(MODAL_TEST_GOTO_NEXT_EVENT, { detail: step + 1 }))
     }
}
const prevBtnClickHandler = (step) => {
     if (step > 1) {
          document.dispatchEvent(new CustomEvent(MODAL_TEST_GOTO_PREV_EVENT, { detail: step - 1 }))
     }
}
