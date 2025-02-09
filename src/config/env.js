require('dotenv').config();

const { 
    DB_HOST,
    DB_USER, 
    DB_PASSWORD, 
    DB_PORT, 
    DB_NAME, 
    PORT,
    TEST_DB_HOST,
    TEST_DB_USER,
    TEST_DB_PASSWORD,
    TEST_DB_NAME,
    TEST_DB_PORT,
    NODE_ENV
 } = process.env;

module.exports = {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_NAME,
    PORT,
    TEST_DB_HOST,
    TEST_DB_USER,
    TEST_DB_PASSWORD,
    TEST_DB_NAME,
    TEST_DB_PORT,
    NODE_ENV
};