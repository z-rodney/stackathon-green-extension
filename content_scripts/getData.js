/*const handleDataRequest = (request, sender, sendResponse) => {
  if (request.command === 'get location data') {
    sendResponse({
      response: `Received request to ${request.command}`
    })
  }
}*/

//browser.runTime.onMessage.addListener(handleDataRequest)
/*(function() {
  if (window.hasRun) {
    return
  }
  window.hasRun = true
  console.log('sending data...')
  const roomCity = document.querySelector('._5twioja').innerText;
  browser.runtime.sendMessage({
    content: {
      action: 'send location data',
      city: roomCity
    }
  })
})()*/
let sent = false
const sendData = () => {
  if (!sent) {
    const city = document.querySelector('._5twioja').innerText;
    browser.runtime.sendMessage({
      action: 'send location data',
      content: {
        city
      }
    })
    sent = true
  }
}
sendData()






//window.addEventListener("click", sendData)


