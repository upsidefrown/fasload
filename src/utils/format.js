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
