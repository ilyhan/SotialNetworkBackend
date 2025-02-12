const { Pool } = require('pg');

const pool = new Pool({
    user: "ilia", 
    password: "qEiqhv4WMhbp507q7ZSCqXmUXzNBEaxi",
    host: "dpg-cum2seqn91rc739phno0-a.oregon-postgres.render.com", // Полное доменное имя
    port: 5432, // Стандартный порт PostgreSQL
    database: "dbpostnest",
    ssl: {
        rejectUnauthorized: false // Если используется SSL, добавьте эту опцию
    }
});

module.exports = pool;