const { pool } = require("../config/db");

beforeAll(async () => {
  // Create tables in the test database
  // await pool.query(`
  //     CREATE TABLE users (
  //         id SERIAL PRIMARY KEY,
  //         name VARCHAR(100) NOT NULL,
  //         email VARCHAR(100) UNIQUE NOT NULL,
  //         birthdate DATE NOT NULL
  //     );
  // `);
  // await pool.query(`
  //     CREATE TABLE gifts (
  //         id SERIAL PRIMARY KEY,
  //         user_id INT REFERENCES users(id),
  //         gift_name VARCHAR(100) NOT NULL,
  //         sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //     );
  // `);
});

afterAll(async () => {
  // Drop tables to clean up
  // await pool.query('DROP TABLE IF EXISTS gifts CASCADE;');
  // await pool.query('DROP TABLE IF EXISTS users CASCADE;');
  // await pool.query("truncate gifts restart identity");
  // await pool.query("truncate users restart identity");
  await pool.end(); // Close the database connection
});
