import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RoleBasedRedirect() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Redirect based on role
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
