

function DataError(message, details) {
  this.message = message
  this.details = details
}

const getLatLon = async (str) => {
  const encodedStr = encodeURI(str)
  try {
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
  } catch (err) {
    throw new DataError('Could not get coordinates', err)
  }
}

const getFIPSCode = async (coordinates) => {
  try {
    const data = await fetch(`https://geo.fcc.gov/api/census/area?lat=${coordinates.lat}&lon=${coordinates.lon}&format=json`, {
      method: 'GET'
    })
    const res = await data.json()
    const fipsCode = res.results[0].county_fips
    return fipsCode
  } catch (err) {
    throw new DataError('Could not get FIPS Code', err)
  }
}

const getCovidData = async (fipsCode) => {
  try {
    const data = await fetch(`https://api.covidactnow.org/v2/county/${fipsCode}.json?apiKey=${covidDataAPIKey}`, {
      method: 'GET',
      mode: 'cors'
    })
    const res = await data.json()
    const { county, state, metrics, riskLevels, lastUpdatedDate } = res
    return {
      overall: riskLevels.overall,
      asOf: lastUpdatedDate,
      dataLocation: {
        state,
        county
      },
      caseDensity: {
        metric: metrics.caseDensity,
        risk: riskLevels.caseDensity
      },
      infectionRate: {
        metric: metrics.infectionRate,
        risk: riskLevels.infectionRate
      },
      testPositivityRatio: {
        metric: metrics.testPositivityRatio,
        risk: riskLevels.testPositivityRatio
      }
    }
  } catch (err) {
    throw new DataError('Could not get COVID Data', err)
  }
}

const findCovidDataForCity = async (searchCity) => {
  try {
    const coordinates = await getLatLon(searchCity)
    const fipsCode = await getFIPSCode(coordinates)
    const covidData = await getCovidData(fipsCode)
    return covidData
  } catch (err) {
    console.log(err)
    return new DataError('Failed to get COVID data for city', err)
  }
}

let cityCovidData
let city

const handleRequest = (request, sender, sendResponse) => {
  if (request.action === 'send location data') {
    console.log(`received: ${request.action}`)
    city = request.content.city
  }
  if (request.action === 'data request') {
    console.log(`received: ${request.action}`)
    cityCovidData = Promise.resolve(findCovidDataForCity(city))
    console.log('sending...', cityCovidData)
    return Promise.resolve(cityCovidData)
  }
}

const handleMessage = async (request, sender, sendResponse) => {
  if (request.action === 'send location data') {
    const { content: { city }} = request
    const tabId = sender.tab.id
    cityCovidData = await findCovidDataForCity(city)
    browser.pageAction.setIcon({
      tabId,
      path: '../popup/img/virus.png'
    })
    sendResponse({response: `Received request to ${request.command}`})
  } else {
    sendResponse({
      response: 'Could not process message',
      request
    })
  }
}

browser.runtime.onMessage.addListener(handleRequest)

/*browser.pageAction.onClicked.addListener((tab) => {
  browser.pageAction.setPopup({
    tabId: tab.id,
    popup: '../popup/safety.html'
  })
  browser.pageAction.openPopup()
  /*browser.runtime.sendMessage({
    action: 'send data',
    //data: cityCovidData
  })
})

//console.log('bg script: logged')*/
