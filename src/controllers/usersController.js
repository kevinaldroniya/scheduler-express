const { pool } = require('../config/db');

const addUser = async (req, res) => {
    try {
        const { name, email, birthDate } = req.body;
        const query = `
            INSERT INTO users (name,email,birthdate) VALUES ($1,$2,$3) RETURNING *
        `
        const newUser = await pool.query(query, [name, email, birthDate]);
        res.status(201).json('User created successfully');
    } catch (err) {
        // console.error(err);
        if (err.code == '23505') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

const getAllUsers = async (req, res) => {
    try {
        const query = `SELECT * FROM users`;
        const allUsers = await pool.query(query);
        resstatus(200).json(allUsers.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT * FROM users WHERE id = $1`;
        const user = await pool.query(query, [id]);

        if (user.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, birthDate } = req.body;
        const query = `UPDATE user SET name = $1, email = $2, birthdate = $3 WHERE id = $4 RETURNING *`;
        const user = await pool.query(query, [name, email, birthDate, id]);
        if (user.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user.rows[0]);
    } catch (err) {
        if (err.code == '23505') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = { addUser, getAllUsers, getUserById, updateUserById }