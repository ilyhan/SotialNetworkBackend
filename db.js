const {Pool} = require('pg');
const pool = new Pool({
    user: "Ilia", 
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "PostNest",
});


module.exports = pool;