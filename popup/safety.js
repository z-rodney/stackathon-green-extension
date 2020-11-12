const root = document.querySelector('#root')
const newNode = document.createElement('p')
newNode.innerText = `You are searching for homes in:`
root.appendChild(newNode)

const handleMessage = (request, sender, sendResponse) => {
  console.log('received msg in popup')
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


/*const getLocationData = async () => {
  const dataRequest = await browser.tabs.sendMessage(
    {
      command: 'get location data'
    }
  )
  console.log(dataRequest)
}*/

browser.runtime.onMessage.addListener(handleMessage)
console.log('popup script: logged')

