const { fork } = require('child_process');

const load = 1000;
const workers = 4; // default to 1
let request = {
  method: 'get',
  url: 'http://localhost:3000',
  data: {}
};

const equalLoad = Math.floor(load / workers);
const remainderLoad = load % workers;

const deployWorkers = async () => {
  const workerResponses = [];

  for (let i = 1; i <= workers; i++) {
    const worker = {};

    if (i === workers) { // last worker gets remainder load, such is life
      worker[i] = fork('./requests', [(equalLoad + remainderLoad).toString(), JSON.stringify(request)]);
    } else {
      worker[i] = fork('./requests', [equalLoad.toString(), JSON.stringify(request)]);
    }

    workerResponses.push(new Promise((res, rej) => {
      worker[i].on('message', response => {
        res(response);
      });

      worker[i].on('error', error => {
        rej(error);
      })
    }));
  }

  try {
    return await Promise.all(workerResponses)
  } catch (e) {
    throw new Error(`Something went wrong:\n${e}`);
  }
};

( async () => {
  const responses = await deployWorkers();
})();