const { Pool } = require('pg')
const pool = new Pool({
    host: 'postgres',
    port: 1337,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
})

module.exports = pool