const handleMessage = (request, sender, sendResponse) => {
  console.log('received msg in bg')
  /*if (request.command === 'get location data') {
    sendResponse({
      response: `Received request to ${request.command}`
    })
  }*/
  const messageDetails = {
    request: request,
    sender: sender,
  }
  console.log(messageDetails)
  sendResponse({
    response: 'received'
  })
}

browser.runtime.onMessage.addListener(handleMessage)

console.log('bg script: logged')
