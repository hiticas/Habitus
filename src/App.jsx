import React, { useState, useEffect, use } from 'react'
import { Link } from 'react-router-dom'
import './App.scss'
import Navbar from './components/Navbar/Navbar'
import WorkoutDetails from './components/WorkoutDetails/WorkoutDetails';

function App() {
  const [workouts, setWorkouts] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('https://habitus-be.vercel.app/api/workouts');
      const data = await response.json();

      if (response.ok) {
        setWorkouts(data);
      }
    }
    fetchWorkouts();
  }, []);

  return (
    <div className="app">
      <Navbar />
      <div>{workouts && workouts.map(workout => (
        <WorkoutDetails key={workout._id} workout={workout} />
      ))}</div>
      
    </div>
  )
}

export default App
