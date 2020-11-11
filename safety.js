const location = document.querySelector('._5twioja').innerText;
const bookItPopUp = document.querySelector('._ud8a1c');
const checkAvailabilityButton = document.querySelector('._fz3zdn')
const safetyDiv = document.createElement('div')
const safetyMsg = document.createElement('p')
safetyMsg.innerText = `Covid High Alert: ${location}`
safetyMsg.className = "orange"
safetyDiv.appendChild(safetyMsg)

bookItPopUp.insertBefore(safetyDiv, checkAvailabilityButton)

console.log(location)

