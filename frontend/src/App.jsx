
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'https://asian-maritime-met-issue.trycloudflare.com/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [loading, setLoading] = useState(true)

  // Fetch expenses from backend
  async function fetchExpenses() {
    try {
      const response = await fetch(API_URL)

      if (!response.ok) throw new Error('Failed to fetch expenses')

      const data = await response.json()
      setExpenses(data)
    } catch (error) {
      console.error(error)
      alert('Cannot connect to backend. Check whether server is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  // Calculate total expenses
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount), 0
  )

  // Add expense through backend
  async function addExpense(e) {
    e.preventDefault()

    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert('Please enter valid expense details')
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          amount: Number(amount)
        })
      })

      if (!response.ok) throw new Error('Could not add expense')

      setTitle('')
      setAmount('')
      await fetchExpenses()
    } catch (error) {
      alert(error.message)
    }
  }

  // Delete expense through backend
  async function deleteExpense(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Could not delete expense')

      await fetchExpenses()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>💰 ExpenseFlow</h2>
        <p className="side-active">▦ Dashboard</p>
        <p>↗ Transactions</p>
        <p>◷ Reports</p>
      </aside>

      <main className="main-content">
        <header>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your spending overview.</p>
          </div>
          <span className="profile">👤 My Account</span>
        </header>

        <section className="summary">
          <div className="summary-card">
            <p>Total Expenses</p>
            <h2>₹{total.toLocaleString('en-IN')}</h2>
            <span>All recorded expenses</span>
          </div>

          <div className="summary-card">
            <p>Total Transactions</p>
            <h2>{expenses.length}</h2>
            <span>Recorded transactions</span>
          </div>

          <div className="summary-card">
            <p>Average Expense</p>
            <h2>
              ₹{expenses.length
                ? Math.round(total / expenses.length).toLocaleString('en-IN')
                : 0}
            </h2>
            <span>Per transaction</span>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <h2>Add New Expense</h2>

            <form onSubmit={addExpense}>
              <label>Expense Name</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter expense name"
              />

              <label>Amount (₹)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
              />

              <label>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Education</option>
                <option>Entertainment</option>
                <option>Other</option>
              </select>

              <button type="submit">+ Add Expense</button>
            </form>
          </div>

          <div className="panel transactions">
            <h2>Recent Transactions</h2>

            {loading ? (
              <p>Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p>No expenses added yet.</p>
            ) : (
              expenses.map(expense => (
                <div className="transaction" key={expense.id}>
                  <div>
                    <strong>{expense.title}</strong>
                    <p>{expense.category} · {expense.date}</p>
                  </div>

                  <div className="transaction-right">
                    <strong>
                      ₹{Number(expense.amount).toLocaleString('en-IN')}
                    </strong>
                    <button
                      className="delete-btn"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
