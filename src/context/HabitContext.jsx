import { createContext, useReducer } from "react"

export const HabitsContext = createContext()

export const habitsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_HABITS':
      return {
        habits: Array.isArray(action.payload) ? action.payload : []
      }
    case 'CREATE_HABIT':
    case 'ADD_HABIT':
      return {
        habits: [action.payload, ...state.habits]
      }
    case 'DELETE_HABIT':
    case 'REMOVE_HABIT':
      return {
        habits: state.habits.filter((h) => h.id !== action.payload && h._id !== action.payload)
      }
    case 'TOGGLE_HABIT':
      return {
        habits: state.habits.map((h) => 
          h.id === action.payload || h._id === action.payload 
            ? { ...h, completed: !h.completed }
            : h
        )
      }
    default:
      return state
  }
}

export const HabitsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitsReducer, {
    habits: []
  })

  return (
    <HabitsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </HabitsContext.Provider>
  )
}