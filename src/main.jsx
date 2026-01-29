import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

import App from './App.jsx';
import About from './pages/About/About.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Workouts from './pages/Workouts/Workouts.jsx';
import Habits from './pages/Habits/Habits.jsx';

import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute.jsx';
import { PublicRoute } from './components/PublicRoute/PublicRoute.jsx';
import { WorkoutsContextProvider } from './context/WorkoutContext.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { HabitsContextProvider } from './context/HabitContext.jsx';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/Signup/Signup.jsx';
import './index.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: '/workouts',
    element: (
      <ProtectedRoute>
        <Workouts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/habits',
    element: (
      <ProtectedRoute>
        <Habits />
      </ProtectedRoute>
    ),
  },
  {
    path: '/about',
    element: (
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contact',
    element: (
      <ProtectedRoute>
        <Contact />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <HabitsContextProvider>
          <RouterProvider router={router} />
        </HabitsContextProvider>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);