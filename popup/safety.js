const mainBody = document.querySelector('#root')
const loadingMsg = document.querySelector('.loading-msg')

const hideElement = (element) => {
  element.className = 'hidden'
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
  bullet2.innerText = `Each case generates ${infectionRate.metric ? infectionRate.metric.toFixed(2) : 'unknown'} cases, on average`
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

const portToBGScript = browser.runtime.connect({ name: 'popup connection' })
portToBGScript.postMessage({ action: 'get covid data' })
let resultMessage
portToBGScript.onMessage.addListener((message) => {
  console.log(message)
  if (message.action === 'send covid data') {
    const covidData = message.cityCovidData
    console.log(covidData)
    if (covidData.overall) {
        resultMessage = generateData(covidData)
      } else {
        resultMessage = generateErrorMessage(covidData)
    }
    hideElement(loadingMsg)
    mainBody.append(resultMessage, detailLink)
  }
})
