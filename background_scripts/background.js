

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

const findCovidDataForCity = (searchCity) => {
    return getLatLon(searchCity).then(value => {
     return getFIPSCode(value)
    }).then(value => {
      return getCovidData(value)
    }).catch(err => {
      console.log(err)
      return new DataError('Failed to get COVID data for city', err)
    })
}

let ports = {}
let city
let cityCovidData
const initConnection = (port) => {
  if (port.name.includes('content script')) ports.csPort = port
  if (port.name.includes('popup')) ports.popupPort = port
  port.postMessage({ action: 'connection confirmed' })
  ports.csPort.postMessage({action: 'get city'})
  port.onMessage.addListener((message) => {
    console.log(message)
    if (message.action === 'send city') {
      city = message.city
      console.log('city in port', city)
      findCovidDataForCity(city).then(value => {
        cityCovidData = value
      }).catch(error => {
        cityCovidData = error
      })
      console.log('covid data in port', cityCovidData)
    }
    if (message.action === 'get covid data') {
        ports.popupPort.postMessage({
          action: 'send covid data',
          cityCovidData
        })
      cityCovidData = {}
    }
  })
}

browser.runtime.onConnect.addListener(initConnection)
