import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './App.scss'

function App() {
  const [habits, setHabits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('habits')) || []
    } catch (e) {
      return []
    }
  })

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', frequency: 'Daily', streak: 0 })
  const [message, setMessage] = useState('')

  const [allowedSlots, setAllowedSlots] = useState(() => {
    try {
      const n = Number(localStorage.getItem('allowedSlots'))
      return n && n > 0 ? n : 3
    } catch (e) {
      return 3
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(habits))
      console.log(habits);
    } catch (e) {
      // ignore storage errors
    }
  }, [habits])

  useEffect(() => {
    try {
      localStorage.setItem('allowedSlots', String(allowedSlots))
    } catch (e) {
      // ignore
    }
  }, [allowedSlots])

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', frequency: 'Daily', streak: 0 })

  const addHabit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (habits.length >= allowedSlots) {
      setMessage(`Limit reached (${allowedSlots}). Please pay to add more slots.`)
      return
    }
    const newHabit = {
      id: Date.now(),
      name: form.name.trim(),
      frequency: form.frequency,
      streak: Number(form.streak) || 0,
    }
    setHabits(prev => [newHabit, ...prev])
    setForm({ name: '', frequency: 'Daily', streak: 0 })
    setShowForm(false)
  }

  const payForSlot = () => {
    const newSlots = allowedSlots + 1
    setAllowedSlots(newSlots)
    setMessage(`Purchased +1 slot. Total allowed: ${newSlots}`)
  }

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    setMessage('Habit deleted.')
  }

  const startEdit = (habit) => {
    setEditingId(habit.id)
    setEditForm({ name: habit.name, frequency: habit.frequency, streak: habit.streak })
    setMessage('')
  }

  const saveEdit = (e) => {
    e.preventDefault()
    setHabits(prev => prev.map(h => h.id === editingId ? { ...h, name: editForm.name.trim() || h.name, frequency: editForm.frequency, streak: Number(editForm.streak) || 0 } : h))
    setEditingId(null)
    setEditForm({ name: '', frequency: 'Daily', streak: 0 })
    setMessage('Habit updated.')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', frequency: 'Daily', streak: 0 })
  }

  return (
    <div className="app">
      <h1>Homepage</h1>
      <nav>
        <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
      </nav>

      <section className="habits-section">
        <h2>Your Habits</h2>

        <div className="controls">
          <button
            className="add-habit-btn"
            onClick={() => {
              if (habits.length >= allowedSlots) {
                setMessage(`Limit reached (${allowedSlots}). Please pay to add more slots.`)
                return
              }
              setShowForm(s => !s)
            }}
          >
            {showForm ? 'Cancel' : 'Add Habit'}
          </button>

          <div className="pay-wrapper">
            <span className="slots">Slots: {habits.length}/{allowedSlots}</span>
            <button className="pay-btn" onClick={payForSlot}>Pay (buy +1 slot)</button>
          </div>
        </div>

        {showForm && (
          <form className="add-habit-form" onSubmit={addHabit}>
            <div>
              <label>
                Name
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </label>
            </div>
            <div>
              <label>
                Frequency
                <input
                  type="text"
                  value={form.frequency}
                  onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                />
              </label>
            </div>
            <div>
              <label>
                Streak
                <input
                  type="number"
                  min="0"
                  value={form.streak}
                  onChange={e => setForm(f => ({ ...f, streak: e.target.value }))}
                />
              </label>
            </div>
            <button type="submit">Save Habit</button>
          </form>
        )}

        {message && <div className="message">{message}</div>}

        <ul className="habits-list">
          {habits.length === 0 && <li className="empty">No habits yet — add one.</li>}
          {habits.map(habit => (
            <li key={habit.id} className="habit-item">
              {editingId === habit.id ? (
                <form className="edit-habit-form" onSubmit={saveEdit}>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  />
                  <input
                    type="text"
                    value={editForm.frequency}
                    onChange={e => setEditForm(f => ({ ...f, frequency: e.target.value }))}
                  />
                  <input
                    type="number"
                    min="0"
                    value={editForm.streak}
                    onChange={e => setEditForm(f => ({ ...f, streak: e.target.value }))}
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={cancelEdit}>Cancel</button>
                </form>
              ) : (
                <>
                  <label>
                    <input type="checkbox" />
                    <span className="habit-name">{habit.name}</span>
                  </label>
                  <span className="habit-meta">{habit.frequency} • Streak: {habit.streak}</span>
                  <button className="edit-btn" onClick={() => startEdit(habit)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App
