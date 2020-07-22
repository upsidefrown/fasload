const axios = require('axios')
const load = Number(process.argv[2])
const request = process.argv[3]

/**
 * Send requests to target server
 * @param {Number} load - amount of requests to send
 * @param {Object} request - axios request config { url: '', method: '', [params: {}], [headers: {}], [data: {}]}
 * @return {Promise} - { times: [], statusCodes: [] }
 */

const sendRequests = async (load, request) => {
  request = JSON.parse(request) // string from process arg
  const requestTimes = []
  const statusCodes = []

  for (let i = 0; load > i; i++) {
    const t0 = Date.now() // (request start time) closure

    requestTimes.push(
      axios(request)
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
  await sendRequests(load, request)
})()
