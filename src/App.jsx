import { useState, useEffect } from 'react'
import { useWorkoutsContext } from './hooks/useWorkoutsContext';

import Navbar from './components/Navbar/Navbar'
import WorkoutDetails from './components/WorkoutDetails/WorkoutDetails';
import WorkoutForm from './components/WorkoutsForm/WorkoutsForm';
import './App.scss'

function App() {
  const { workouts, dispatch } = useWorkoutsContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      // const response = await fetch('/api/workouts');
      const response = await fetch('https://habitus-be.vercel.app/api/workouts');
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: data });
      }
    }
    fetchWorkouts();
  }, []);

  return (
    <div className="app">
      <Navbar />
      <div className="main">
        <div className="workout-details">
          {workouts && workouts.map(workout => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))}
        </div>
        <div className="workout-form-wrapper">
          <WorkoutForm />
        </div>
      </div>
    </div>
  )
}

export default App
