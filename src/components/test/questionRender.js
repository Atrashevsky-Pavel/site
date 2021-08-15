const render = (root, question) => {
     if (!(root instanceof Node)) return console.error('ModalTest-root: root should be Node')

     while (root.firstChild) root.removeChild(root.firstChild)

     root.appendChild(question)
}

export default render