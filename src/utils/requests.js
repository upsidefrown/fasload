const { createReadStream } = require('fs')
const axios = require('axios')
const FormData = require('form-data')

/**
 * Format request for form data w/ or w/out file upload read stream
 * @param {Object} request - axios request config {.., data: [ ['key', val], ..]}
 * @return {Object} - new axios request config obj formatted with form data
 */
const formatWithFormData = (request) => {
  const requestCopy = { ...request }
  const form = new FormData()
  requestCopy.data.forEach(keyVal => {
    keyVal[1][0] === 'file'
      ? form.append(keyVal[0], createReadStream(keyVal[1][1]))
      : form.append(keyVal[0], keyVal[1])
  })

  requestCopy.headers = {
    ...request.headers,
    ...form.getHeaders() // NEED to add computed headers
  }
  requestCopy.data = form

  return requestCopy
}

/**
 * Send requests to target server
 * @param {Number} load - amount of requests to send
 * @param {Object} request - axios request config { url: '', method: '', [params: {}], [headers: {}], [data: ""/JSON/[form]}
 * @return {Promise} - { times: [], statusCodes: [] }
 */

const sendRequests = async (load, request) => {
  request = JSON.parse(request) // string from process arg
  const requestTimes = []
  const statusCodes = []

  for (let i = 0; load > i; i++) {
    // read stream must be created here for form data (can't be passed in)
    let formattedRequest = Array.isArray(request.data)
      ? formatWithFormData(request)
      : request

    const t0 = Date.now() // (request start time) closure

    requestTimes.push(
      axios(formattedRequest)
        .then((response) => {
          let milliseconds = Date.now() - t0 // end time right after promise resolve
          statusCodes.push(response.status)

          return milliseconds
        })
        .catch(e => {
          let milliseconds = Date.now() - t0 // keep as first operation
          e.response ? statusCodes.push(e.response.status) : statusCodes.push(e.code)

          return milliseconds
        })
    )
  }

  try {
    const responses = {
      times: await Promise.all(requestTimes),
      statusCodes
    }

    process.send(responses) // pass responsse up to parent process
  } catch (e) {
    throw new Error(`Sending requests failed:\n${e}`)
  }
};

(async () => {
  const load = Number(process.argv[2])
  const request = process.argv[3]

  await sendRequests(load, request)
})()
