import './WorkoutDetails.scss';

const WorkoutDetails = ({ workout }) => {
  return (
    <div className="container">
        <h2>{workout.title}</h2>
        <p>Load: {workout.load}</p>
        <p>Reps: {workout.reps}</p>
        <p>{workout.createdAt}</p>
    </div>
  );
}

export default WorkoutDetails;