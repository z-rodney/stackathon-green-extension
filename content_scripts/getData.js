const portToBackgroundScript = browser.runtime.connect({ name: 'content script connection' })

portToBackgroundScript.onMessage.addListener((message) => {
  console.log(message)
  if (message.action === 'get city') {
    const city = document.querySelector('._5twioja').innerText;
    portToBackgroundScript.postMessage({
      action: 'send city',
      city
    })
  }
})

