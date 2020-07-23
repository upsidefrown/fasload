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

  if (params.length) axiosConfig.params = formatKeyVal(params)
  if (headers.length) axiosConfig.headers = formatKeyVal(headers)
  if (request.body.active === 'form' && body.length) axiosConfig.data = formatKeyVal(body)
  if (request.body.active === 'text' && body) axiosConfig.data = body
  if (request.body.active === 'json' && body) axiosConfig.data = JSON.parse(body)

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

  const tenPercentIdx = Math.floor(times.length / 10)
  const twentyFivePercentIdx = Math.floor(times.length / 4)
  const fiftyPercentIdx = Math.floor(times.length / 2)
  const seventyFivePercentIdx = twentyFivePercentIdx + fiftyPercentIdx
  const ninetyPercentIdx = times.length - tenPercentIdx
  const ninetyNinePercentIdx = times.length - Math.floor(times.length / 100)

  if (tenPercentIdx) distribution['10'] = times[tenPercentIdx + 1]
  if (twentyFivePercentIdx) distribution['25'] = times[twentyFivePercentIdx + 1]
  if (fiftyPercentIdx) distribution['50'] = times[fiftyPercentIdx + 1]
  if (seventyFivePercentIdx) distribution['75'] = times[seventyFivePercentIdx + 1]
  if (ninetyPercentIdx) distribution['90'] = times[ninetyPercentIdx + 1]
  if (ninetyNinePercentIdx) distribution['99'] = times[ninetyNinePercentIdx + 1]

  return distribution
}
