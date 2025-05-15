// require('dotenv').config();
// const { Pool } = require('pg');

// const pool = new Pool({
//     user: "ilia", 
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST, 
//     port: 5432, 
//     database: "PostNest",
//     ssl: {
//         rejectUnauthorized: false 
//     }
// });

// module.exports = pool;

const {Pool} = require('pg');
const pool = new Pool({
    user: "Ilia", 
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "PostNest",
});


module.exports = pool;