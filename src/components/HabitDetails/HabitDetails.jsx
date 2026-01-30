import { useHabitsContext } from '../../hooks/useHabitsContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import './HabitDetails.scss';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const HabitDetails = ({ habit }) => {
  const { dispatch } = useHabitsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('https://habitus-be.vercel.app/api/habits/' + habit._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_HABIT', payload: data });
      console.log('Habit deleted:', data);
    }
  }

  return (
    <div className="container">
        <h2>{habit.title}</h2>
        <h3>To do: {habit.date}</h3>
        {/* <p>{formatDistanceToNow(new Date(habit.createdAt), { addSuffix: true })}</p> */}
        <span className='btn-delete material-symbols-outlined' onClick={handleClick}>delete</span>
    </div>
  );
}

export default HabitDetails;