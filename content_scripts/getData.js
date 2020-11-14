console.log('running')

/*const handleDataRequest = (request, sender, sendResponse) => {
  if (request.action === 'get city') {
    const roomCity = document.querySelector('._5twioja').innerText
    sendResponse({
      roomCity
    })
  }
}

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

/*const sendData = () => {
  const city = document.querySelector('._5twioja').innerText;
  browser.runtime.sendMessage({
    action: 'send location data',
    content: {
      city
    }
    console.log('sending from cs:', city)
  })
}

browser.runtime.sendMessage({action: 'send message on load'})

sendData()

console.log('ran')
//browser.runtime.onMessage.addListener()






window.addEventListener("click", sendData)*/

let sent = false
const sendData = () => {
  //if (!sent) {
    const city = document.querySelector('._5twioja').innerText;
    browser.runtime.sendMessage({
      action: 'send location data',
      content: {
        city
      }
    })
    //sent = true
  //}
  //sent = false
}
sendData()


