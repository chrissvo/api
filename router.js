const glob = require('glob')
const path = require('path')

// Grab all the endpoints
const endpoints = glob.sync('./endpoints/*.js').map(filepath => path.parse(filepath).name)

module.exports = postgres => ((request, response) => {
  // Set some defaults
  response.statusCode = 200
  response.setHeader('Content-Type', 'application/json')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET')
  response.setHeader('Access-Control-Max-Age', 2592000) // 30 days
  response.setHeader('Access-Control-Allow-Headers', '*')
  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  // Parse URL
  const uri = new URL(`https://${request.headers.host}${request.url}`)
  const path = uri.pathname.replace('/', '')

  // If this request is to an unknown endpoint return 404
  if (!endpoints.includes(path)) {
    response.writeHead(404)
    return response.end(JSON.stringify({ error: 'Invalid endpoint' }))
  }

  // If the endpoint does exist execute it
  require(`./endpoints/${path}.js`)(request, response, postgres)
})
