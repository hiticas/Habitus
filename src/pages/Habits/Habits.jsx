import { useEffect } from 'react'
import { useHabitsContext } from '../../hooks/useHabitsContext';
import { useAuthContext } from '../../hooks/useAuthContext';

import Navbar from '../../components/Navbar/Navbar'
import HabitDetails from '../../components/HabitDetails/HabitDetails';
import HabitForm from '../../components/HabitsForm/HabitsForm';
import './Habits.scss'
import YearCalendar from '../../components/YearCalendar/YearCalendar';

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

  groupedHabits.sort((a, b) => a.title.localeCompare(b.title));

  const toggleHabitDate = async (date, existingRecord, habit) => {
    try {
      if (!existingRecord) {
        // ✅ Default → create completed habit
        await fetch(`https://habitus-be.vercel.app/api/habits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({
            title: habit.title,
            color: habit.color,
            completed: true,
            date: date
          })
        });

      } else if (!existingRecord.completed) {
        // ✅ Not completed → update to completed
        await fetch(`https://habitus-be.vercel.app/api/habits/${existingRecord._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({
            completed: true
          })
        });

      } else if (existingRecord.completed) {
        // ✅ Completed → delete habit → return to default
        await fetch(`https://habitus-be.vercel.app/api/habits/${existingRecord._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          }
        });
      }

      // Refresh habits after any action
      const response = await fetch("https://habitus-be.vercel.app/api/habits", {
        headers: { "Authorization": `Bearer ${user.token}` }
      });

      const data = await response.json();
      dispatch({ type: "SET_HABITS", payload: data });

    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="main">
        <div className="habit-details">
          {groupedHabits && groupedHabits.map(habit => (
            <div key={habit.title} className="mb-6">
              <YearCalendar 
                habit={{
                  title: habit.title,
                  color: habit.color,
                  dates: habit.dates, 
                  onToggle: (date, existing) => toggleHabitDate(date, existing, habit)
                }}
              />
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
