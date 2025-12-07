import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/auth/store/auth.store';
import {
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaGift,
  FaSnowflake,
  FaTree,
  FaBell,
} from 'react-icons/fa';
import { Button } from '../ui/button';
import { Logo } from '../Logo';

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
    <div className="flex h-screen w-full bg-white md:bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop - (No modificado) */}
      <div
        className={`hidden md:block bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-center">
            {sidebarOpen ? (
              <Logo variant="full" showText={true} />
            ) : (
              <Logo variant="icon" />
            )}
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'
              }`}
            >
              <FaTree className="w-5 h-5 shrink-0 text-green-600 animate-pulse" />
              {sidebarOpen && <span>Inicio</span>}
            </button>
            <button
              onClick={() => navigate('/admin/ninos')}
              className={`w-full flex items-center rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors ${
                sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'
              }`}
            >
              <FaSnowflake className="w-5 h-5 shrink-0 text-blue-400" />
              {sidebarOpen && <span>Gestión de Niños</span>}
            </button>
            <button
              onClick={() => navigate('/admin/asistencias')}
              className={`w-full flex items-center rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors ${
                sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'
              }`}
            >
              <FaBell className="w-5 h-5 shrink-0 text-yellow-500" />
              {sidebarOpen && <span>Control de Asistencias</span>}
            </button>
            {user?.roles.includes('admin') && (
              <>
                <div className="border-t border-gray-200 my-2" />
                <button
                  onClick={() => navigate('/admin/reportes')}
                  className={`w-full flex items-center rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors ${
                    sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'
                  }`}
                >
                  <FaGift className="w-5 h-5 shrink-0 text-red-500" />
                  {sidebarOpen && <span>Reportes</span>}
                </button>
                <button
                  onClick={() => navigate('/admin/usuarios')}
                  className={`w-full flex items-center rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors ${
                    sidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'
                  }`}
                >
                  <FaUserPlus className="w-5 h-5 shrink-0 text-green-600" />
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
              className={`w-full flex items-center ${
                sidebarOpen ? 'justify-start' : 'justify-center px-0'
              }`}
            >
              <FaSignOutAlt className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="ml-2">Cerrar Sesión</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <>
          {/* Overlay oscuro - igual que mts: bg-black/80 para ver contenido opaco detrás */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 z-40 md:hidden transition-opacity duration-300"
          />
          {/* Sidebar móvil */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl z-50 md:hidden overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <Logo variant="full" showText={true} />
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  navigate('/admin');
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <FaTree className="w-5 h-5 shrink-0 text-green-600 animate-pulse" />
                <span>Inicio</span>
              </button>
              <button
                onClick={() => {
                  navigate('/admin/ninos');
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FaSnowflake className="w-5 h-5 shrink-0 text-blue-400" />
                <span>Gestión de Niños</span>
              </button>
              <button
                onClick={() => {
                  navigate('/admin/asistencias');
                  setMobileDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <FaBell className="w-5 h-5 shrink-0 text-yellow-500" />
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
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <FaGift className="w-5 h-5 shrink-0 text-red-500" />
                    <span>Reportes</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/admin/usuarios');
                      setMobileDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <FaUserPlus className="w-5 h-5 shrink-0 text-green-600" />
                    <span>Usuarios</span>
                  </button>
                </>
              )}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                <FaSignOutAlt className="w-4 h-4 shrink-0" />
                <span className="ml-2">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Main Content - sin translate en móvil para que se vea el contenido opaco detrás como en mts */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() =>
              isMobile
                ? setMobileDrawerOpen(true)
                : setSidebarOpen(!sidebarOpen)
            }
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaBars className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden md:block shrink-0">
              <img
                src="/jubileo-2025.png"
                alt="Jubileo 2025 - Peregrinos de Esperanza"
                className="h-12 max-w-[120px] w-auto object-contain cursor-pointer"
                onClick={() => navigate('/admin')}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Novena del Niño Dios
            </h2>
          </div>
          <div className="w-10" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
