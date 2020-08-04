/**
 * Formats nested key val array to key val map
 * @param {Array} keyValArray - [['key', 'val'], ..]
 * @returns {Object} - { key: val, ..}
 */
export const formatKeyVal = keyValArray => {
  const keyValObj = {}

  // strip out empties (if BOTH key and val empty)
  for (let keyVal of keyValArray) {
    if (keyVal[0] === '' && keyVal[1] === '') continue

    keyValObj[keyVal[0]] = keyVal[1]
  }

  return keyValObj
}

/**
 * Formats a request object to axios config input
 * @param {Object} request - provided request object
 * @returns {Object} - formatted to axios request config
 */
export const formatToAxios = request => {
  const params = request.params.form
  const headers = request.headers.form
  const body = request.body[request.body.active]

  const axiosConfig = {
    method: request.method,
    url: request.url
  }

  if (headers.length) axiosConfig.headers = formatKeyVal(headers)
  if (params.length) axiosConfig.params = formatKeyVal(params)

  // request body excluded for GET requests
  if (request.method !== 'get') {
    // form data handled on `requests` worker, as read stream for file uploads can't be
    // passed as arg, and new stream needed for each request (see 'utils/request.js')
    if (request.body.active === 'form' && body.length) axiosConfig.data = body

    if (request.body.active === 'text' && body) axiosConfig.data = body
    if (request.body.active === 'json' && body) axiosConfig.data = JSON.parse(body)
  }

  return axiosConfig
}

/**
 * Aggregates all responses from request workers
 * @param {Array} responses - worker responses [ { times: [], statusCodes: [] }, ...]
 * @returns {Object} - { times: [], statusCodes: { code: amount, ... } }
 */
export const aggregateResponses = responses => {
  let times = []
  let statusCodes = {}

  responses.forEach(response => {
    times = times.concat(response.times)

    response.statusCodes.forEach(code => {
      if (statusCodes[code]) {
        statusCodes[code] += 1
      } else {
        statusCodes[code] = 1
      }
    })
  })

  return { times, statusCodes }
}

/**
 * Sorts array of int times
 * @param {Array} times - unsorted, single depth array of int times
 * @returns {Array} - [ sorted times ... ]
 */
export const sortTimes = times => {
  // TODO: implement better sorting algorithm for large data sets
  return times.sort((a, b) => a - b)
}

/**
 * Formats sorted response times to a percentile distribution
 * @param {Array} sortedResponseTimes - sorted, single depth array of int response times
 * @returns {Object} - { 10: requestTimesforPercentile, 25: requestTimesforPercentile, ...}
 */
export const latencyDistribution = sortedResponseTimes => {
  const distribution = {}
  const times = sortedResponseTimes

  const tenPercent = Math.floor(times.length / 10)
  const twentyFivePercent = Math.floor(times.length / 4)
  const fiftyPercent = Math.floor(times.length / 2)
  const seventyFivePercent = Math.floor((times.length / 4) * 3)
  const ninetyPercent = Math.floor((times.length / 10) * 9)
  const ninetyNinePercent = times.length - Math.floor(times.length / 100)
  const oneHundredPercent = times.length

  if (times.length >= 10 && tenPercent) distribution['10'] = times[tenPercent - 1]
  if (times.length >= 4 && twentyFivePercent) distribution['25'] = times[twentyFivePercent - 1]
  if (times.length >= 2 && fiftyPercent) distribution['50'] = times[fiftyPercent - 1]
  if (times.length >= 4 && seventyFivePercent) distribution['75'] = times[seventyFivePercent - 1]
  if (times.length >= 10 && ninetyPercent) distribution['90'] = times[ninetyPercent - 1]
  if (times.length >= 100 && ninetyNinePercent) distribution['99'] = times[ninetyNinePercent - 1]
  if (ninetyNinePercent) distribution['100'] = times[oneHundredPercent - 1]

  return distribution
}
