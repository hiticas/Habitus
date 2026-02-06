import { useState } from 'react'
import { useHabitsContext } from '../../hooks/useHabitsContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import './HabitsForm.scss'

const HabitForm = () => {
  const { dispatch } = useHabitsContext();
  const { user } = useAuthContext();
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [color, setColor] = useState('#667eea');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const colors = [
    { color: '#667eea' },
    { color: '#4ecdc4' },
    { color: '#ff6b6b' },
    { color: '#f7b731' },
    { color: '#45b7d1' },
    { color: '#a29bfe' },
    { color: '#fd79a8' },
    { color: '#fdcb6e' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!user) {
      setError('You must be logged in');
      return;
    }

    const finalDate = year && month && day ? `${year}-${month}-${day}` : '';

    const habit = { title, date: finalDate, color, completed };

    const response = await fetch('https://habitus-be.vercel.app/api/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      setEmptyFields(data.emptyFields);
    }
    
    if (response.ok) {
      setTitle('');
      setDate('');
      setError(null);
      setEmptyFields([]);
      console.log('New habit added:', data);
      dispatch({ type: 'CREATE_HABIT', payload: data });
    }
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <div>
        <h3>Add a New Habit</h3><br />
        <label>Habit Title:</label><br />
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className={emptyFields?.includes('title') ? 'error' : ''}
        />
      </div>
      <div>
        <label>Date:</label><br />
        <div className="date-dropdowns">
          {/* Year */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={emptyFields?.includes('date') ? 'error' : ''}
          >
            <option value="">Year</option>
            {[...Array(6)].map((_, i) => {
              const y = 2026 + i; // 2026 - 2031
              return (
                <option key={y} value={y}>{y}</option>
              );
            })}
          </select>

          {/* Month */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={emptyFields?.includes('date') ? 'error' : ''}
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={String(m).padStart(2, '0')}>
                {m}
              </option>
            ))}
          </select>

          {/* Day */}
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={emptyFields?.includes('date') ? 'error' : ''}
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={String(d).padStart(2, '0')}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label>Color:</label><br />
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="color-dropdown"
          style={{
          backgroundColor: color,       // 🌈 selected color appears here
          color: "transparent",         // hides default text
          textShadow: "0 0 0 #0000",    // ensures no text is visible
        }}
        >
          {colors.map((item) => (
            <option
              key={item.color}
              value={item.color}
              style={{ backgroundColor: item.color }}
            >
              {/* empty text so only color shows */}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button>Add Habit</button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  );
}

export default HabitForm;