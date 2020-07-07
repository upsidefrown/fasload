const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('success');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Mock server started on port 3000');
});

module.exports = server;