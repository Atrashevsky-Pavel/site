const validate = questions => {
     if (questions === null) return questionsError(`"questionsData" not founded.`)
     if (!(questions instanceof Array)) return questionsError(`"questions" type should be Array`)
     if (questions.length === 0) return questionsError(`"questions" array are empty`)

     for (let i = 0; i < questions.length; i++) {
          const result = validateQuestion(questions[i], i)
          if (result) return result
     }

     return { isOk: true }
}

const validateQuestion = (question, index) => {
     if (typeof question !== 'object') return questionsError(`"questions" item with index ${index} type should be Object`)
     if (question.question === undefined) return questionsError(`"questions" item with index ${index} should contains property "question"`)
     if (typeof question.question !== 'string') return questionsError(`"questions" item with index ${index} property "question" type should be String`)
     if (question.answers === undefined) return questionsError(`Array: "questions"\nItem with index: ${index}\nError: questions should contains property "answers"`)
     if (!(question.answers instanceof Array)) return questionsError(`Array: "questions"\nItem with index: ${index}\nError: property "answers" type should be Array`)
     if (question.answers.length === 0) return questionsError(`Array: "questions"\nItem with index: ${index}\nError: array "answers" are empty`)

     for (let i = 0; i < question.answers.length; i++) {
          const result = validateAnswer(question.answers[i], i, index)
          if (result) return result
     }
}

const validateAnswer = (answer, answerIndex, index) => {
     if (answer.text === undefined) return questionsError(`Array: "questions"\nItem with index: ${index}\nProperty: answers\nItem with index: ${answerIndex}\nError: "answer" should contains property "text"`)
     if (typeof answer.text !== 'string') return questionsError(`Array: "questions"\nItem with index: ${index}\nProperty: answers\nItem with index: ${answerIndex}\nError: property "text" type should be String`)
     if (answer.img !== undefined && (typeof answer.img !== 'string')) return questionsError(`Array: "questions"\nItem with index: ${index}\nProperty: answers\nItem with index: ${answerIndex}\nError: property "img" type should be String`)
}

const questionsError = (message = null) => ({ isOk: false, message })

export default validate