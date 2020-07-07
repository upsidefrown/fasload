const { sendRequests } = require('../index');

require('./mock-http'); // start mock server

const options = {
  method: 'get',
  url: 'http://localhost:3000',
  data: {}
};

( async () => {
  try {
    const results = await sendRequests(200, options);
    console.log(results);
  } catch (e) {
    console.error(e);
  }

  process.exit(0);
})();
