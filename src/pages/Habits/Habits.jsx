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

  return (
    <div className="app">
      <Navbar />
      <div className="main">
        <div className="habit-details">
          {habits && habits.map(habit => (
            <HabitDetails key={habit._id} habit={habit} />
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
