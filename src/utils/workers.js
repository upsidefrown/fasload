import { fork } from 'child_process'
import { join } from 'path'

export const deployWorkers = async (request, load, workers) => {
  const requestWorkerPath = join(__dirname, 'requests')
  const equalLoad = Math.floor(load / workers)
  const remainderLoad = load % workers
  const workerResponses = []

  for (let i = 1; i <= workers; i++) {
    const worker = {}

    if (i === workers) { // last worker gets remainder load, such is life
      worker[i] = fork(requestWorkerPath, [(equalLoad + remainderLoad).toString(), JSON.stringify(request)])
    } else {
      worker[i] = fork(requestWorkerPath, [equalLoad.toString(), JSON.stringify(request)])
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
