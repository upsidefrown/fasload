const axios = require('axios')
const load = Number(process.argv[2])
const request = process.argv[3]

/**
 * Send requests to target server
 * @param {Number} load - amount of requests to send
 * @param {Object} request - axios request parameters and options
 * @return {Promise} - request times (ms) in send order + any index mapped errors
 */

const sendRequests = async (load, request) => {
  request = JSON.parse(request) // string from process arg
  const requests = []
  const errors = {}

  for (let i = 0; load > i; i++) {
    const t0 = Date.now() // (start time) closure

    requests.push(
      axios(request)
        .then(() => Date.now() - t0) // end time on resolve
        .catch(e => {
          let milliseconds = Date.now() - t0 // keep as first operation

          e.response ? errors[i] = e.response.status : errors[i] = e.code
          return milliseconds
        })
    )
  }

  try {
    const responses = {
      times: await Promise.all(requests),
      errors
    }

    process.send(responses) // pass responsse up to parent process
  } catch (e) {
    throw new Error(`Sending requests failed:\n${e}`)
  }
};

( async () => {
  await sendRequests(load, request)
})()