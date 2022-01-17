const pg = require('pg')

module.exports = uri => new pg.Pool({
  connectionString: uri,
  ssl: { rejectUnauthorized: false }
})
