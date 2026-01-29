import { useEffect } from 'react'
import { useWorkoutsContext } from '../../hooks/useWorkoutsContext';
import { useAuthContext } from '../../hooks/useAuthContext';

import Navbar from '../../components/Navbar/Navbar'
import WorkoutDetails from '../../components/WorkoutDetails/WorkoutDetails';
import WorkoutForm from '../../components/WorkoutsForm/WorkoutsForm';
import './Workouts.scss'

function Workouts() {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('https://habitus-be.vercel.app/api/workouts', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: data });
      }
    }

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

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

export default Workouts
