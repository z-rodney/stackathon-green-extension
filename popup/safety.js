//apikeys removed for git commit

const form = document.querySelector('form');

const getLatLon = async (str) => {
  const encodedStr = encodeURI(str)
  const data = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodedStr}&key=${openCageAPIKey}&limit=1&no_annotations=1`, {
    method: 'GET'
  })
  const res = await data.json()
  const { lat, lng } = res.results[0].geometry
  const coordinates = {
    lat: lat.toFixed(2),
    lon: lng.toFixed(2)
  }
  return coordinates
}

const getFIPSCode = async (coordinates) => {
  const data = await fetch(`https://geo.fcc.gov/api/census/area?lat=${coordinates.lat}&lon=${coordinates.lon}&format=json`, {
    method: 'GET'
  })
  const res = await data.json()
  const fipsCode = res.results[0].county_fips
  return fipsCode
}

const getCovidData = async (fipsCode) => {
  const data = await fetch(`https://api.covidactnow.org/v2/county/${fipsCode}.json?apiKey=${covidDataAPIKey}`, {
    method: 'GET',
    mode: 'cors'
  })
  const res = await data.json()
  const { metrics, riskLevels, lastUpdatedDate } = res
  return {
    metrics,
    riskLevels,
    lastUpdatedDate
  }
}

const handleSubmit = async (ev) => {
  ev.preventDefault()
  const searchCity = document.querySelector('#search-location').value
  const coordinates = await getLatLon(searchCity)
  const fipsCode = await getFIPSCode(coordinates)
  const covidData = await getCovidData(fipsCode)
  console.log(covidData)
}

form.addEventListener("submit", handleSubmit)







/*const handleMessage = (request, sender, sendResponse) => {
  console.log('received msg in popup')
  if (request.command === 'get location data') {
    sendResponse({
      response: `Received request to ${request.command}`
    })
  }
  const messageDetails = {
    request: request,
    sender: sender,
  }
  console.log(messageDetails)
  sendResponse({
    response: 'received'
  })
}


const getLocationData = async () => {
  const dataRequest = await browser.tabs.sendMessage(
    {
      command: 'get location data'
    }
  )
  console.log(dataRequest)
}

browser.runtime.onMessage.addListener(handleMessage)
console.log('popup script: logged')*/

