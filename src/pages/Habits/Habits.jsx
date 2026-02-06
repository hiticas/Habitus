import { useState, useEffect } from 'react'
import { useHabitsContext } from '../../hooks/useHabitsContext';
import { useAuthContext } from '../../hooks/useAuthContext';

import Navbar from '../../components/Navbar/Navbar'
import HabitDetails from '../../components/HabitDetails/HabitDetails';
import HabitForm from '../../components/HabitsForm/HabitsForm';
import PieChart from '../../components/PieChart/PieChart';
import './Habits.scss'
import YearCalendar from '../../components/YearCalendar/YearCalendar';

function Habits() {
  const { habits, dispatch } = useHabitsContext();
  const { user } = useAuthContext();

  // 👇 YEAR STATE
  const [year, setYear] = useState(new Date().getFullYear());

  const prevYear = () => setYear((y) => y - 1);
  const nextYear = () => setYear((y) => y + 1);

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
  console.log(groupedHabits, "groupedHabits");
  

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
    <div className="habits-page">
      <Navbar />
      <div className="main">
        <div className='header'>
          <div className="habit-form-wrapper">
            <HabitForm /> 
          </div>
          <div className="pie-chart-wrapper">
            <PieChart habits={groupedHabits} />
          </div>
        </div>
        <div className="habit-details">
          {/* YEAR HEADER WITH ARROWS */}
          {groupedHabits.length > 0 && (
            <div className="year-header">
              <button className="year-arrow" onClick={prevYear}>←</button>
              <h2>{year}</h2>
              <button className="year-arrow" onClick={nextYear}>→</button>
            </div>
          )}
          {groupedHabits && groupedHabits.map(habit => (
            <div key={habit.title} className="mb-6">
              <YearCalendar 
                year={year}
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
      </div>
    </div>
  )
}

export default Habits
