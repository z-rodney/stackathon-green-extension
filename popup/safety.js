const roomCity = document.querySelector('._5twioja').innerText;
const root = document.querySelector('#root')
const newNode = document.createElement('p')
newNode.innerText = `You are searching for homes in: ${roomCity}`
root.appendChild(newNode)
