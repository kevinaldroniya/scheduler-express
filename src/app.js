const express = require('express');
const routes = require('./routes');
const { pool } = require('./config/db');

const app = express();
app.use(express.json());

app.use('/api', routes);

//Test db connection
pool.query('SELECT NOW()', (err, res) => {
    if(err) console.error('Error connection to database', err);
    else console.log('Database connected successfully:', res.rows[0].now);
});

module.exports = app;