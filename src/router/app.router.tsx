import { createBrowserRouter, Outlet, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

// Lazy loading de páginas
const LoginPage = lazy(() => import('../auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('../admin/pages/DashboardPage'));
const NinosPage = lazy(() => import('../ninos/pages/NinosPage'));
const AsistenciasPage = lazy(() => import('../asistencias/pages/AsistenciasPage'));
const ReportsPage = lazy(() => import('../reports/pages/ReportsPage'));
const UsersPage = lazy(() => import('../users/pages/UsersPage'));

// Componente de carga
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-sm font-medium text-gray-600">Cargando...</p>
    </div>
  </div>
);

// Layout wrapper para rutas de admin
const AdminLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'ninos',
        element: <NinosPage />,
      },
      {
        path: 'asistencias',
        element: <AsistenciasPage />,
      },
      {
        path: 'reportes',
        element: (
          <ProtectedRoute requiredRoles={['admin']}>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'usuarios',
        element: (
          <ProtectedRoute requiredRoles={['admin']}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/admin" replace />,
  },
]);

