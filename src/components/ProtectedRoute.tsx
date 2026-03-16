import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  requiredRoles?: ('sale_manager' | 'sales_assistant')[];
}

const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps = {}) => {
  const { isAuthenticated, user, token, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Check if user has valid token and is authenticated
  if (!token || !isAuthenticated || !user) {
    // Don't redirect from login page
    if (location.pathname === '/login') {
      return <Outlet />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(user.role)) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
