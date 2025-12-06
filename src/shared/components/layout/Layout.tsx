import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';
import { LogOut, Menu, Users, Calendar, Home, FileText, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <div className={`hidden md:block bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              {sidebarOpen && (
                <h1 className="text-xl font-bold text-gray-900">Novena</h1>
              )}
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              {sidebarOpen && <span>Inicio</span>}
            </button>
            <button
              onClick={() => navigate('/admin/ninos')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <Users className="w-5 h-5" />
              {sidebarOpen && <span>Gestión de Niños</span>}
            </button>
            <button
              onClick={() => navigate('/admin/asistencias')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              {sidebarOpen && <span>Control de Asistencias</span>}
            </button>
            {user?.roles.includes('admin') && (
              <>
                <div className="border-t border-gray-200 my-2" />
                <button
                  onClick={() => navigate('/admin/reportes')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  {sidebarOpen && <span>Reportes</span>}
                </button>
                <button
                  onClick={() => navigate('/admin/usuarios')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  {sidebarOpen && <span>Usuarios</span>}
                </button>
              </>
            )}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="mb-4">
              {sidebarOpen && user && (
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{user.email}</p>
                </div>
              )}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span className="ml-2">Cerrar Sesión</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white h-full shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Novena</h1>
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  navigate('/admin');
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Inicio</span>
              </button>
              <button
                onClick={() => {
                  navigate('/admin/ninos');
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Gestión de Niños</span>
              </button>
              <button
                onClick={() => {
                  navigate('/admin/asistencias');
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>Control de Asistencias</span>
              </button>
              {user?.roles.includes('admin') && (
                <>
                  <div className="border-t border-gray-200 my-2" />
                  <button
                    onClick={() => {
                      navigate('/admin/reportes');
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Reportes</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/usuarios');
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Usuarios</span>
                  </button>
                </>
              )}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="w-4 h-4" />
                <span className="ml-2">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="flex-1 bg-black bg-opacity-40"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => (isMobile ? setMobileDrawerOpen(true) : setSidebarOpen(!sidebarOpen))}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Novena del Niño Dios</h2>
          <div className="w-10" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

