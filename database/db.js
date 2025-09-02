const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'clinical_cases_db',
    password: 'clinical_db_password123',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};