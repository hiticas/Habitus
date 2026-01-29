import { useState } from 'react'
import { useHabitsContext } from '../../hooks/useHabitsContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import './HabitsForm.scss'

const HabitForm = () => {
  const { dispatch } = useHabitsContext();
  const { user } = useAuthContext();
  
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!user) {
      setError('You must be logged in');
      return;
    }

    const habit = { title };

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
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields?.includes('title') ? 'error' : ''}
      />

      <button>Add Habit</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default HabitForm;