/*const handleDataRequest = (request, sender, sendResponse) => {
  if (request.command === 'get location data') {
    sendResponse({
      response: `Received request to ${request.command}`
    })
  }
}*/

//browser.runTime.onMessage.addListener(handleDataRequest)
const roomCity = document.querySelector('._5twioja').innerText;

const sendData = () => {
  console.log('sending data...')
  browser.runTime.sendMessage({
    content: {
      city: roomCity
    }
  })
}

window.addEventListener("click", sendData)


