interface FooterProps {
  darkMode?: boolean;
}

export function Footer({ darkMode = false }: FooterProps) {
  return (
    <footer
      className={`${
        darkMode
          ? 'bg-transparent'
          : 'bg-gray-50 border-t border-gray-200'
      } py-4 px-4 md:px-4 mt-auto`}
    >
      <div className={`${darkMode ? 'max-w-4xl' : 'max-w-xs'} mx-auto`}>
        {darkMode ? (
          // Footer para login con logo Pastoral y fondo transparente
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <p className="text-sm text-center text-slate-300">
              Desarrollado con <span className="text-red-500">❤️</span> por la{' '}
              <span className="font-medium text-slate-200">
                Pastoral de Comunicación
              </span>
            </p>
            <img
              src="/logo-pastoral-comunicacion.png"
              alt="Pastoral de Comunicación"
              className="h-10 w-auto object-contain"
              style={{ transform: 'scale(1.3)' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          // Footer para panel con texto y logo Pastoral
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <p className="text-sm text-center text-gray-600">
              Desarrollado con <span className="text-red-500">❤️</span> por la{' '}
              <span className="font-medium text-gray-700">
                Pastoral de Comunicación
              </span>
            </p>
            <img
              src="/logo-pastoral-comunicacion.png"
              alt="Pastoral de Comunicación"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </footer>
  );
}

