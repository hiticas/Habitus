import { useAuthContext } from "./useAuthContext"
import { useWorkoutsContext } from "./useWorkoutsContext"
import { useHabitsContext } from "./useHabitsContext"

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: workoutsDispatch } = useWorkoutsContext()
  const { dispatch: habitsDispatch } = useHabitsContext()

  const logout = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    workoutsDispatch({ type: 'SET_WORKOUTS', payload: null })
    habitsDispatch({ type: 'SET_HABITS', payload: null })
  }

  return { logout }
}