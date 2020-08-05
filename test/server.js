const { promisify } = require('util')
const timeout = promisify(setTimeout)
const express = require('express')
const fileUpload = require('express-fileupload')

const server = express()
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(fileUpload({}));

server.post('/route2', async (req, res) => {
  const randomMilliSec = Math.round(Math.random() * 10000) / 3

  await timeout(randomMilliSec)

  res.json({ status: "success", data: { foo: "bar"} })
})

server.listen(3000, () => {
  console.log('Test server listening on port 3000')
})