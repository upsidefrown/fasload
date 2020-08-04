import { fork } from 'child_process'
import { join } from 'path'
import { worker } from 'cluster'

const isDev= process.env.NODE_ENV !== 'production'

/**
 * Deploys workers to perform axios requests concurrently
 * @param {Object} request - axios request options { url: '', method: '', [params: {}], [headers: {}], [data: {body}]}
 * @param {Number} load - int amount of requests to send
 * @param {Number} workers - int amount of concurrent worker processes to spin up
 * @returns {Promise} - worker responses [ { times: [], statusCodes: { code: amount } }, ... ]
 */

export const deployWorkers = async (request, load, workers) => {
  // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#handling-static-assets
  const devPath = join('src', 'workers', 'requests.js')
  const prodPath = join(__static, 'requests.js')
  const workerPath = isDev ? devPath : prodPath

  const equalLoad = Math.floor(load / workers)
  const remainderLoad = load % workers
  const workerResponses = []

  for (let i = 1; i <= workers; i++) {
    const worker = {}

    if (i === Number(workers)) { // last worker gets remainder load, such is life
      worker[i] = fork(workerPath, [(equalLoad + remainderLoad).toString(), JSON.stringify(request)])
    } else {
      worker[i] = fork(workerPath, [equalLoad.toString(), JSON.stringify(request)])
    }

    workerResponses.push(
      new Promise((resolve, reject) => {
        worker[i].on('message', responses => {
          resolve(responses)
        })

        worker[i].on('error', error => {
          reject(error)
        })
      })
    )
  }

  try {
    return await Promise.all(workerResponses)
  } catch (e) {
    throw new Error(`Something went wrong:\n${e}`)
  }
}
