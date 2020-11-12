import { openCageAPIKey } from './secrets'

export const getLatLon = async (str) => {
  const encodedStr = encodeURI(str)
  const data = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodedStr}&key=${openCageAPIKey}&limit=1&no_annotations=1`, {
    method: 'GET'
  })
  return data.json()
}
