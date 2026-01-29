import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  // While loading, return nothing (blank screen while checking auth)
  if (loading) {
    return null;
  }

  // If user is logged in, redirect to home page
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // If user is not logged in, render the component (login/signup)
  return children;
};
