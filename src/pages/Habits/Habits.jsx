import { useEffect } from 'react'
import { useHabitsContext } from '../../hooks/useHabitsContext';
import { useAuthContext } from '../../hooks/useAuthContext';

import Navbar from '../../components/Navbar/Navbar'
import HabitDetails from '../../components/HabitDetails/HabitDetails';
import HabitForm from '../../components/HabitsForm/HabitsForm';
import './Habits.scss'

function Habits() {
  const { habits, dispatch } = useHabitsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchHabits = async () => {
      const response = await fetch('https://habitus-be.vercel.app/api/habits', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_HABITS', payload: data });
      }
    }

    if (user) {
      fetchHabits();
    }
  }, [dispatch, user]);

  // Group habits by title to show unique habits with all their dates
  const groupedHabits = habits && habits.length > 0 ? 
    habits.reduce((acc, habit) => {
      const existing = acc.find(h => h.title === habit.title);
      if (existing) {
        // Add date to existing grouped habit
        if (!existing.dates) existing.dates = [];
        existing.dates.push({ date: habit.date, completed: habit.completed, _id: habit._id });
      } else {
        // Create new grouped habit
        acc.push({
          title: habit.title,
          color: habit.color,
          dates: [{ date: habit.date, completed: habit.completed, _id: habit._id }]
        });
      }
      return acc;
    }, [])
    : [];

  const toggleHabit = async (habitId) => {
    const habit = habits.find(h => h._id === habitId || h.id === habitId);
    if (!habit) return;
    
    try {
      await fetch(`https://habitus-be.vercel.app/api/habits/${habit._id || habit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ completed: !habit.completed })
      });
      
      // Refetch all habits to ensure UI updates
      const response = await fetch('https://habitus-be.vercel.app/api/habits', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_HABITS', payload: data });
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="main">
        <div className="habit-details">
          {groupedHabits && groupedHabits.map(habit => (
            <div key={habit.title} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: habit.color, marginBottom: '0.5rem' }}>{habit.title}</h3>
              <div style={{ paddingLeft: '1rem' }}>
                {habit.dates && habit.dates.map((dateEntry, idx) => (
                  <div key={`${habit.title}-${idx}`} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    opacity: dateEntry.completed ? 0.6 : 1
                  }}>
                    <input
                      type="checkbox"
                      checked={dateEntry.completed}
                      onChange={() => toggleHabit(dateEntry._id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ 
                      textDecoration: dateEntry.completed ? 'line-through' : 'none'
                    }}>
                      {dateEntry.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="habit-form-wrapper">
          <HabitForm /> 
        </div>
      </div>
    </div>
  )
}

export default Habits
