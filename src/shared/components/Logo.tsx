
interface LogoProps {
  variant?: 'full' | 'icon' | 'compact';
  className?: string;
  showText?: boolean;
  lightMode?: boolean; // Para fondos oscuros como en login
}

export function Logo({
  variant = 'full',
  className = '',
  showText = true,
  lightMode = false,
}: LogoProps) {
  // Variante completa con logo y texto
  if (variant === 'full') {
    return (
      <div
        className={`flex items-center gap-3 ${className}`}
      >
        <div className="shrink-0 flex items-center justify-center">
          <img
            src={lightMode ? "/jubileo-2025.png" : "/SMA.png"}
            alt="Parroquia Santa María de los Ángeles"
            className="h-12 w-auto object-contain max-w-[48px]"
            style={{ transform: 'scale(1.5)' }}
            onError={(e) => {
              // Fallback si la imagen no existe
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div
            className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg"
            style={{ display: 'none' }}
          >
            <span className="text-white">M</span>
          </div>
        </div>
        {showText && (
          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold leading-tight ${
                lightMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Parroquia Santa María
            </span>
            <span
              className={`text-xs leading-tight ${
                lightMode ? 'text-slate-300' : 'text-gray-600'
              }`}
            >
              de los Ángeles
            </span>
          </div>
        )}
      </div>
    );
  }

  // Variante solo icono
  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center w-full ${className}`}>
        <img
          src="/SMA.png"
          alt="Parroquia Santa María de los Ángeles"
          className="h-10 w-10 object-contain"
          style={{ minWidth: '40px', minHeight: '40px', transform: 'scale(1.5)' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold"
          style={{ display: 'none' }}
        >
          <span className="text-white">M</span>
        </div>
      </div>
    );
  }

  // Variante compacta (para sidebar colapsado)
  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <img
        src="/SMA.png"
        alt="Parroquia"
        className="h-10 w-10 object-contain"
        style={{ minWidth: '40px', minHeight: '40px', transform: 'scale(1.5)' }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div
        className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold"
        style={{ display: 'none' }}
      >
        <span className="text-white">M</span>
      </div>
    </div>
  );
}
