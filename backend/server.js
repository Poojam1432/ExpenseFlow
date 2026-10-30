
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('Smart Expense Tracker Backend is Running!');
});

// Get all expenses (temporary test data)
let expenses = [
    {
        id: 1,
        title: 'Groceries',
        category: 'Food',
        amount: 1200,
        date: '2026-10-29'
    },
    {
        id: 2,
        title: 'Bus Ticket',
        category: 'Travel',
        amount: 250,
        date: '2026-10-28'
    }
];

// GET API
app.get('/api/expenses', (req, res) => {
    res.json(expenses);
});

// ADD API
app.post('/api/expenses', (req, res) => {
    const { title, category, amount } = req.body;

    if (!title || !category || !Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid expense details' });
    }

    const newExpense = {
        id: Date.now(),
        title,
        category,
        amount,
        date: new Date().toISOString().slice(0, 10)
    };

    expenses.push(newExpense);

    res.status(201).json(newExpense);
});

// DELETE API
app.delete('/api/expenses/:id', (req, res) => {
    const id = Number(req.params.id);
    const initialLength = expenses.length;

    expenses = expenses.filter(expense => expense.id !== id);

    if (expenses.length === initialLength) {
        return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
