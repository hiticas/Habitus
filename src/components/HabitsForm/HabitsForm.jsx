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

    const habit = { title, date, color, completed };

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
      <h3>Add a New Habit</h3>

      <label>Habit Title:</label>
      <br/>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields?.includes('title') ? 'error' : ''}
      />
      <br/>
      <label>Date:</label>
      <br/>
      <input
        type="text"
        onChange={(e) => setDate(e.target.value)}
        placeholder='2026-02-25'
        value={date}
        className={emptyFields?.includes('date') ? 'error' : ''}
      />
      <br/><label>Habit Color:</label><br/>
      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="color-dropdown"
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
      <br/>

      <button>Add Habit</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default HabitForm;