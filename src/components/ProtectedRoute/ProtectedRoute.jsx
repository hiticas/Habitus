import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  // While loading, return nothing (blank screen while checking auth)
  if (loading) {
    return null;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the component
  return children;
};
