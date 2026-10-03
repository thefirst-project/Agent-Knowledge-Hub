import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, requireSuperAdmin = false }) {
  const { isAuthenticated, isLoading, isSuperAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) window.location.hash = '#/admin/login';
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <div className="admin-auth-loading" role="status">Checking your session…</div>;
  }
  if (!isAuthenticated) return null;
  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <main className="admin-access-denied" role="alert">
        <h1>Access denied</h1>
        <p>Access denied — superadmin only.</p>
      </main>
    );
  }
  return children;
}

export default ProtectedRoute;
