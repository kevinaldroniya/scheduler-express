const { Pool } = require('pg');

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    TEST_DB_HOST,
    TEST_DB_USER,
    TEST_DB_PASSWORD,
    TEST_DB_NAME,
    TEST_DB_PORT,
    NODE_ENV
} = require('./env');

const pool = new Pool({
    host: NODE_ENV === 'test' ? TEST_DB_HOST : DB_HOST,
    user: NODE_ENV === 'test' ? TEST_DB_USER : DB_USER,
    password: NODE_ENV === 'test' ? TEST_DB_PASSWORD : DB_PASSWORD,
    database: NODE_ENV === 'test' ? TEST_DB_NAME : DB_NAME,
    port: NODE_ENV === 'test' ? TEST_DB_PORT : DB_PORT,
});


console.log('test_db:',TEST_DB_NAME);
console.log('NODE_ENV:', NODE_ENV);
console.log({
    database: pool.options.database,
})

module.exports = { pool }
