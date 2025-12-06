import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';
import { hasAdminPanelAccess } from '@/shared/api/interceptors';
import { useEffect, useState } from 'react';
import { checkAuthAction } from '@/auth/actions/check-status';
import { isTokenExpired } from '@/shared/utils/tokenUtils';
import { useTokenExpirationCheck } from '@/shared/hooks/useTokenExpirationCheck';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useTokenExpirationCheck({
    checkInterval: 60000,
    checkImmediately: true,
    onExpired: () => {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token && isTokenExpired(token)) {
        localStorage.removeItem('token');
        logout();
        setIsChecking(false);
        return;
      }
      
      if (token && !isAuthenticated) {
        try {
          const userData = await checkAuthAction();
          setUser(userData);
        } catch {
          localStorage.removeItem('token');
          logout();
        }
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, setUser, logout]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/admin" replace />;
    }
  }

  if (location.pathname.startsWith('/admin')) {
    const canAccessPanel = hasAdminPanelAccess(user.roles);
    if (!canAccessPanel) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

