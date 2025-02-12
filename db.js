require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: "ilia", 
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST, 
    port: 5432, 
    database: "dbpostnest",
    ssl: {
        rejectUnauthorized: false 
    }
});

module.exports = pool;