const titleBar = document.querySelector('.titlebar-container')
const safetyDiv = document.createElement('div')
const safetyMsg = document.createElement('p')
safetyMsg.innerText = 'Covid High Alert'
safetyDiv.appendChild(safetyMsg)
titleBar.appendChild(safetyDiv)
console.log(titleBar)
