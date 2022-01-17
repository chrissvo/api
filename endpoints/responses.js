// Get postdata out of a request
const getPayload = request => {
  return new Promise(resolve => {
    let body = ''
    request.on('data', data => {
      body += data.toString()
    })
    request.on('end', () => {
      try {
        const json = JSON.parse(body)
        resolve(json)
      } catch (error) {
        console.log('[ERROR] ==>', error)
        console.log('[ERROR: Raw body] ==>', body)
        console.log('[ERROR: Parsed body] ==>', querystring.parse(body))
        const post = querystring.parse(body)
        resolve(post)
      }
    })
  })
}

// Method to post response to the database
const postResponse = async (request, response, postgres) => {
  try {
    // Load request body
    const payload = await getPayload(request)
    const fields = Object.keys(payload)
    const values = Object.values(payload)
    const { rows: [responses] } = await postgres.query(
      [
        'INSERT INTO responses',
        `(${fields.join(', ')})`,
        `VALUES (${values.map((_, i) => '$' + (i + 1))})`,
        'RETURNING *'
      ].join(' '),
      values
    )
    return response.end(JSON.stringify({ responses }))
  } catch(e) {
    console.log('=> Error:', e)
    response.writeHead(404)
    return response.end(JSON.stringify({ error: 'Database connection failed' }))
  }

}

const newOrg = async (db, { orgSlug, orgName }) => {
  const values = [orgSlug, orgName]
  const fields = ['organisation_slug', 'organisation_name']
  const {
    rows: [organisation]
  } = await db.query(
    [
      'INSERT INTO organisations',
      `(${fields.join(', ')})`,
      `VALUES (${values.map((_, i) => '$' + (i + 1))})`,
      'RETURNING *'
    ].join(' '),
    values
  )
  return organisation
}

module.exports = (request, response, postgres) => {
  if (request.method === 'POST') postResponse(request, response, postgres)
  else {
    response.writeHead(404)
    response.end(JSON.stringify({ error: "Method not implemented" }))
  }
}
