require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Check database connection
pool.connect()
    .then(client => {
        console.log('PostgreSQL connected successfully!');
        client.release();
    })
    .catch(err => {
        console.error('PostgreSQL connection error:', err.message);
    });

// Test route
app.get('/', (req, res) => {
    res.send('ExpenseFlow Backend is Running!');
});

// GET all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM expenses ORDER BY id DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Failed to fetch expenses' });
    }
});

// ADD expense
app.post('/api/expenses', async (req, res) => {
    const { title, category, amount } = req.body;

    const numericAmount = Number(amount);

    if (!title || !category || !Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: 'Invalid expense details' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO expenses (title, category, amount) VALUES ($1, $2, $3) RETURNING *',
            [title, category, numericAmount]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Failed to add expense' });
    }
});

// DELETE expense
app.delete('/api/expenses/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM expenses WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Failed to delete expense' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`ExpenseFlow backend running on port ${PORT}`);
});
