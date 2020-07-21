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

  if (params.length > 0) axiosConfig.params = formatKeyVal(params)
  if (headers.length > 0) axiosConfig.headers = formatKeyVal(headers)
  if (request.body.active === 'form') {
    if (body.length > 0) axiosConfig.body = formatKeyVal(body)
  } else {
    axiosConfig.body = body
  }

  return axiosConfig
}

/**
 * Aggregates responses from request workers
 * @param {Array} responses - load test aggregate worker responses
 * @returns {Object} - {errors, times}
 */
export const aggregateResponses = responses => {
  let errors = []
  let times = []

  responses.forEach(response => {
    if (response.errors) errors = errors.concat(response.errors)
    times = times.concat(response.times)
  })

  return { errors, times }
}

export const latencyDistribution = aggregateResponses => {
  const distribution = {}

  const times = aggregateResponses.times.sort((a, b) => a - b)

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
