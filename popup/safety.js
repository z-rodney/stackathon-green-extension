//const form = document.querySelector('form');
const mainBody = document.querySelector('#root')
//const mainInput = document.querySelector('#main-input')

const hideElement = (element) => {
  element.className = 'hidden'
}

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

const overallRisk = (num) => {
  switch (num) {
    case 0:
      return 'Low'
    case 1:
      return 'Medium'
    case 2:
      return 'High'
    case 3:
      return 'Critical'
    default:
      return 'Unknown'
  }
}

const generateData = (covidData) => {
  const { dataLocation: { state, county }, asOf, overall, caseDensity, infectionRate, testPositivityRatio} = covidData
  const mainDiv = document.createElement('div')
  const heading1 = document.createElement('h2')
  const heading2 = document.createElement('h3')
  const dateInfo = document.createElement('p')
  const listWrapper = document.createElement('ul')
  const bullet1 = document.createElement('li')
  const bullet2 = document.createElement('li')
  const bullet3 = document.createElement('li')
  heading1.innerText = 'Covid Data'
  heading2.innerText = `${overallRisk(overall)} Risk in ${county}, ${state}`
  heading2.className = `risk-${overall}`
  dateInfo.innerText = `as of ${new Date(asOf).toDateString()}`
  bullet1.innerText = `${Math.ceil(caseDensity.metric) || 'Unknown'} cases per 100,000 people`
  bullet1.className = `risk-${caseDensity.risk}`
  bullet2.innerText = `Each case generates ${infectionRate.metric ? infectionRate.metric.toFixed(2) : 'Unknown'} cases, on average`
  bullet2.className = `risk-${infectionRate.risk}`
  bullet3.innerText = `${testPositivityRatio.metric ? (testPositivityRatio.metric * 100).toFixed(2) : 'Unknown'}% test positivity rate`
  bullet3.className = `risk-${testPositivityRatio.risk}`
  listWrapper.append(bullet1, bullet2, bullet3)
  mainDiv.append(heading1, heading2, dateInfo, listWrapper)
  return mainDiv
}

const generateErrorMessage = (error) => {
  const errorDiv = document.createElement('div')
  const errMessage = document.createElement('h2')
  const errDetail = document.createElement('p')
  errMessage.innerText = 'Uh-oh'
  errDetail.innerText = error.message
  errorDiv.append(errMessage, errDetail)
  return errorDiv
}

const detailLink = document.createElement('a')
detailLink.innerText = 'Get more details'
detailLink.setAttribute('href', 'https://www.covidactnow.org/?s=1314325')

const handleSubmit = async (ev) => {
  ev.preventDefault()
  const searchCity = document.querySelector('#search-location').value
  let resultMessage
  try {
    const coordinates = await getLatLon(searchCity)
    const fipsCode = await getFIPSCode(coordinates)
    const covidData = await getCovidData(fipsCode)
    console.log(coordinates)
    console.log(fipsCode)
    console.log(covidData)
    resultMessage = generateData(covidData)
  } catch (err) {
    console.log(err)
    resultMessage = generateErrorMessage(err)
  }
  //hideElement(mainInput)
  mainBody.append(resultMessage, detailLink)
}

//form.addEventListener("submit", handleSubmit)


/*const handleMessage = async (request, sender, sendResponse) => {
  console.log('request pu:', request)
  console.log('sender pu:', sender)
  console.log('received msg in popup')
  if (request.action === 'send data') {
    let resultMessage
    const { data } = request
    if (data.overall) {
      resultMessage = generateData(data)
    } else {
      resultMessage = generateErrorMessage(data)
    }
    mainBody.append(resultMessage, detailLink)
    sendResponse({
      response: `Received request to ${request.command}`
    })
  }
}*/

const handleRes = (message) => {
  console.log(message)
}

handleErr = (err) => {
  console.log('err', err)
}

const init = async () => {
  const response = await browser.runtime.sendMessage({
    action: 'data request'
  })
  console.log(response)
  let resultMessage
  if (response.overall) {
      resultMessage = generateData(response)
    } else {
      resultMessage = generateErrorMessage(response)
    }
    mainBody.append(resultMessage, detailLink)
}

init()


//browser.runtime.onMessage.addListener(handleMessage)

