import { useWorkoutsContext } from '../../hooks/useWorkoutsContext';
import './WorkoutDetails.scss';

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();

  const handleClick = async () => {
    const response = await fetch('https://habitus-be.vercel.app/api/workouts/' + workout._id, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: data });
      console.log('Workout deleted:', data);
    }
  }

  return (
    <div className="container">
        <h2>{workout.title}</h2>
        <p>Load: {workout.load}</p>
        <p>Reps: {workout.reps}</p>
        <p>{workout.createdAt}</p>
        <span className='btn-delete' onClick={handleClick}>delete</span>
    </div>
  );
}

export default WorkoutDetails;