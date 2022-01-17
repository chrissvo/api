const http = require('http')

// Initialise a webserver
const postgres = require('./initialisers/postgres')(process.env.DATABASE_URI)
const router = require('./router')(postgres)
const server = http.createServer(router)
const port = process.env.PORT || 3000

// Log errors
server.on('error', (err, socket) => {
  console.error(`=> An error has occurred:`, err.message)
  console.error(err.stack)
  socket.end(JSON.stringify({ error: true }))
  process.exit(1)
})

// Log each request
server.on('request', ({ method, url }) => {
  const now = new Date()
  console.info(`=> ${now.toUTCString()} - ${method} ${url}`)
})

// Start listening
server.listen(port, async () => {
  console.log(`=> FRIS 2022 API running on port ${port}`)
})
