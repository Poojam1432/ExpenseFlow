import { useEffect, useState } from 'react'
import './App.css'

const PROFILE_KEY = 'expenseflow-demo-profile'
const EXPENSES_KEY_PREFIX = 'expenseflow-demo-expenses:'

function expensesKey(email) {
  return `${EXPENSES_KEY_PREFIX}${String(email || '').trim().toLowerCase()}`
}

function readUserExpenses(email) {
  try { return JSON.parse(localStorage.getItem(expensesKey(email)) || '[]') }
  catch { return [] }
}

function writeUserExpenses(email, items) {
  localStorage.setItem(expensesKey(email), JSON.stringify(items))
}

function App() {
  const [expenses, setExpenses] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) } catch { return null }
  })
  const [authMode, setAuthMode] = useState('login')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [activeNav, setActiveNav] = useState('Dashboard')

  // Demo-only account separation: each email gets its own expenses in this browser.
  // No shared backend expense endpoint is called from this frontend.
  useEffect(() => {
    if (profile?.email) setExpenses(readUserExpenses(profile.email))
    else setExpenses([])
    setLoading(false)
  }, [profile?.email])

  function saveProfile(nextProfile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile))
    setProfile(nextProfile)
  }

  function handleAuth(e) {
    e.preventDefault()
    if (!authEmail.trim() || !authPassword.trim()) {
      alert('Please enter your email and password.')
      return
    }
    if (authMode === 'signup' && !authName.trim()) {
      alert('Please enter your name.')
      return
    }
    // Frontend demo profile only; this does not authenticate against a server.
    const name = authMode === 'signup'
      ? authName.trim()
      : (authEmail.split('@')[0] || 'ExpenseFlow User').replace(/[._-]/g, ' ')
    saveProfile({ name, email: authEmail.trim() })
    setAuthPassword('')
  }

  function logout() {
    localStorage.removeItem(PROFILE_KEY)
    setProfile(null)
    setExpenses([])
    setProfileOpen(false)
    setLoading(true)
  }

  function openEditProfile() {
    setEditName(profile?.name || '')
    setEditEmail(profile?.email || '')
    setEditOpen(true)
    setProfileOpen(false)
  }

  function updateProfile(e) {
    e.preventDefault()
    if (!editName.trim() || !editEmail.trim()) return
    saveProfile({ name: editName.trim(), email: editEmail.trim() })
    setEditOpen(false)
  }

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

  function addExpense(e) {
    e.preventDefault()
    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert('Please enter valid expense details')
      return
    }
    const nextExpenses = [{
      id: `local-${Date.now()}`,
      title: title.trim(),
      category,
      amount: Number(amount),
      date: new Date().toISOString().slice(0, 10),
    }, ...expenses]
    writeUserExpenses(profile.email, nextExpenses)
    setExpenses(nextExpenses)
    setTitle('')
    setAmount('')
  }

  function deleteExpense(id) {
    const nextExpenses = expenses.filter(expense => expense.id !== id)
    writeUserExpenses(profile.email, nextExpenses)
    setExpenses(nextExpenses)
  }

  if (!profile) {
    return (
      <div className="auth-shell">
        <div className="auth-decoration">
          <div className="auth-brand"><span className="brand-mark">E</span> ExpenseFlow</div>
          <div className="auth-message">
            <span className="eyebrow">YOUR MONEY, IN CONTROL</span>
            <h1>Make every<br />rupee <em>count.</em></h1>
            <p>A clearer view of your spending starts here. Keep your everyday expenses organised in one simple place.</p>
            <div className="auth-stat-row">
              <div><strong>Track</strong><span>Every expense</span></div>
              <div><strong>Understand</strong><span>Your habits</span></div>
              <div><strong>Plan</strong><span>With confidence</span></div>
            </div>
          </div>
          <div className="auth-footer">© 2026 ExpenseFlow · Personal finance, made simple</div>
        </div>
        <div className="auth-main">
          <div className="auth-card">
            <div className="mobile-brand"><span className="brand-mark">E</span> ExpenseFlow</div>
            <div className="auth-heading">
              <span className="eyebrow">{authMode === 'login' ? 'WELCOME BACK' : 'GET STARTED'}</span>
              <h2>{authMode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
              <p>{authMode === 'login' ? 'Enter your details to continue to ExpenseFlow.' : 'A few details and you are ready to go.'}</p>
            </div>
            <form className="auth-form" onSubmit={handleAuth}>
              {authMode === 'signup' && (
                <label>Full name
                  <input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Enter your full name" autoComplete="name" />
                </label>
              )}
              <label>Email address
                <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
              </label>
              <label>Password
                <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Enter your password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} required />
              </label>
              <button className="primary-btn auth-submit" type="submit">{authMode === 'login' ? 'Sign in' : 'Create account'} <span>→</span></button>
            </form>
            <p className="auth-switch">
              {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>{authMode === 'login' ? 'Create account' : 'Sign in'}</button>
            </p>
            <p className="demo-note">Demo mode · Each email has separate expenses saved only in this browser.</p>
          </div>
        </div>
      </div>
    )
  }

  const initials = profile.name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">E</span><span>ExpenseFlow</span></div>
        <span className="nav-caption">WORKSPACE</span>
        <button className={`nav-item ${activeNav === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveNav('Dashboard')}><span>▦</span> Dashboard</button>
        <button className={`nav-item ${activeNav === 'Transactions' ? 'active' : ''}`} onClick={() => setActiveNav('Transactions')}><span>↗</span> Transactions</button>
        <button className={`nav-item ${activeNav === 'Reports' ? 'active' : ''}`} onClick={() => setActiveNav('Reports')}><span>◷</span> Reports</button>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><span className="tip-icon">✦</span><strong>Small steps add up.</strong><p>Stay mindful of where your money goes.</p></div>
          <div className="sidebar-user"><div className="avatar">{initials || 'U'}</div><div className="sidebar-user-info"><strong>{profile.name}</strong><span>{profile.email}</span></div><button title="Open profile" onClick={() => setProfileOpen(!profileOpen)}>•••</button></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activeNav}</strong></div>
          <div className="topbar-right">
            <span className="today-label">PERSONAL FINANCE</span>
            <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
              <div className="avatar">{initials || 'U'}</div><span>{profile.name}</span><span className="chevron">⌄</span>
            </button>
            {profileOpen && <div className="profile-menu">
              <div className="menu-profile"><div className="avatar">{initials || 'U'}</div><div><strong>{profile.name}</strong><span>{profile.email}</span></div></div>
              <button onClick={openEditProfile}>✎ &nbsp; Edit profile</button>
              <button onClick={logout}>↪ &nbsp; Sign out</button>
            </div>}
          </div>
        </header>

        <section className="welcome-row">
          <div><span className="eyebrow">OVERVIEW</span><h1>{activeNav === 'Dashboard' ? `Good to see you, ${profile.name.split(' ')[0]}.` : activeNav}</h1><p>Here's what's happening with your money today.</p></div>
          <div className="date-pill"><span>◷</span> Your expense overview</div>
        </section>

        <section className="summary">
          <div className="summary-card total-card"><div className="card-top"><span>Total expenses</span><span className="card-icon purple">₹</span></div><h2>₹{total.toLocaleString('en-IN')}</h2><span className="card-foot">All recorded expenses</span></div>
          <div className="summary-card"><div className="card-top"><span>Transactions</span><span className="card-icon blue">↗</span></div><h2>{expenses.length}</h2><span className="card-foot">Recorded transactions</span></div>
          <div className="summary-card"><div className="card-top"><span>Average expense</span><span className="card-icon orange">⌁</span></div><h2>₹{expenses.length ? Math.round(total / expenses.length).toLocaleString('en-IN') : 0}</h2><span className="card-foot">Per transaction</span></div>
        </section>

        {activeNav === 'Dashboard' ? (
          <section className="content-grid">
            <div className="panel add-panel">
              <div className="panel-heading"><div><span className="eyebrow">NEW ENTRY</span><h2>Add an expense</h2></div><span className="panel-icon">＋</span></div>
              <form onSubmit={addExpense}>
                <label>Expense name<input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Lunch with friends" /></label>
                <label>Amount (₹)<input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></label>
                <label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option>Food</option><option>Travel</option><option>Shopping</option><option>Education</option><option>Entertainment</option><option>Other</option></select></label>
                <button className="primary-btn" type="submit">＋ Add expense</button>
              </form>
            </div>
            <div className="panel transactions">
              <div className="panel-heading"><div><span className="eyebrow">YOUR ACTIVITY</span><h2>Recent transactions</h2></div><span className="count-pill">{expenses.length} total</span></div>
              {loading ? <p className="empty-state">Loading expenses...</p> : expenses.length === 0 ? <div className="empty-state"><span>◷</span><strong>No expenses yet</strong><p>Your recent activity will appear here.</p></div> : expenses.map(expense => (
                <div className="transaction" key={expense.id}>
                  <div className="transaction-symbol">{(expense.category || 'O').slice(0, 1).toUpperCase()}</div>
                  <div className="transaction-info"><strong>{expense.title}</strong><p>{expense.category} <span>·</span> {expense.date}</p></div>
                  <div className="transaction-right"><strong>−₹{Number(expense.amount).toLocaleString('en-IN')}</strong><button className="delete-btn" onClick={() => deleteExpense(expense.id)}>Delete</button></div>
                </div>
              ))}
            </div>
          </section>
        ) : activeNav === 'Transactions' ? (
          <section className="panel transactions full-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR ACTIVITY</span><h2>All transactions</h2></div><span className="count-pill">{expenses.length} total</span></div>
            {loading ? <p className="empty-state">Loading expenses...</p> : expenses.length === 0 ? <p className="empty-state">No expenses added yet.</p> : expenses.map(expense => <div className="transaction" key={expense.id}><div className="transaction-symbol">{(expense.category || 'O').slice(0, 1).toUpperCase()}</div><div className="transaction-info"><strong>{expense.title}</strong><p>{expense.category} <span>·</span> {expense.date}</p></div><div className="transaction-right"><strong>−₹{Number(expense.amount).toLocaleString('en-IN')}</strong><button className="delete-btn" onClick={() => deleteExpense(expense.id)}>Delete</button></div></div>)}
          </section>
        ) : (
          <section className="panel report-panel"><span className="eyebrow">SPENDING SUMMARY</span><h2>Your expense summary</h2><div className="report-total"><span>Total recorded</span><strong>₹{total.toLocaleString('en-IN')}</strong></div><div className="report-total"><span>Number of transactions</span><strong>{expenses.length}</strong></div><div className="report-total"><span>Average transaction</span><strong>₹{expenses.length ? Math.round(total / expenses.length).toLocaleString('en-IN') : 0}</strong></div></section>
        )}
        <footer className="page-footer">ExpenseFlow <span>·</span> Take control of your everyday spending.</footer>
      </main>

      {editOpen && <div className="modal-backdrop" onClick={() => setEditOpen(false)}><div className="profile-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setEditOpen(false)}>×</button><span className="eyebrow">YOUR ACCOUNT</span><h2>Edit profile</h2><p>Update the details shown in your ExpenseFlow profile.</p><form onSubmit={updateProfile}><label>Full name<input value={editName} onChange={e => setEditName(e.target.value)} required /></label><label>Email address<input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required /></label><button className="primary-btn" type="submit">Save changes</button></form></div></div>}
    </div>
  )
}

export default App
