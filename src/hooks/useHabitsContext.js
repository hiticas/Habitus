import { useContext } from 'react';
import { HabitsContext } from '../context/HabitContext';

export const useHabitsContext = () => {
  const context = useContext(HabitsContext);

  if (!context) {
    throw new Error(
      'useHabitsContext must be used inside a HabitsContextProvider'
    );
  }

  return context;
};
