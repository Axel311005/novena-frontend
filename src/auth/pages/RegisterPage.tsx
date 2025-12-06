import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiUser } from 'react-icons/hi';
import { toast } from 'sonner';
import { registerAction } from '../actions/register.action';
import { useAuthStore } from '../store/auth.store';
import { hasAdminPanelAccess } from '@/shared/api/interceptors';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nombre?: string;
  apellido?: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, isAuthenticated } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellido: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      const { user } = useAuthStore.getState();
      if (user && hasAdminPanelAccess(user.roles)) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const userData = await registerAction({
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
      });

      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }

      setUser(userData);
      
      toast.success('¡Cuenta creada exitosamente!');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (hasAdminPanelAccess(userData.roles)) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      let errorMessage = 'Error al crear la cuenta. Por favor, intenta nuevamente.';

      if (error?.response?.data) {
        const errorData = error.response.data;

        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Estrellas decorativas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-orange-500 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-50 animate-pulse delay-300" />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-pink-400 rounded-full opacity-40 animate-pulse delay-700" />
        <div className="absolute bottom-20 right-20 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-60 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Panel central */}
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            {/* Logo e ícono */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center mb-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-2">Novena del Niño Dios</h1>
              <p className="text-slate-300 text-sm">Crea tu cuenta para comenzar</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('nombre')}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  />
                  <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Apellido
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('apellido')}
                    placeholder="Tu apellido"
                    className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  />
                  <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register('email', {
                      required: 'El correo electrónico es requerido',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Correo electrónico inválido',
                      },
                    })}
                    placeholder="correo@ejemplo.com"
                    className={`w-full px-4 py-3 pl-11 bg-slate-700/50 border rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all ${
                      errors.email ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-orange-500'
                    }`}
                  />
                  <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'La contraseña es requerida',
                      minLength: {
                        value: 4,
                        message: 'La contraseña debe tener al menos 4 caracteres',
                      },
                    })}
                    placeholder="********"
                    className={`w-full px-4 py-3 pl-11 pr-11 bg-slate-700/50 border rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all ${
                      errors.password ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-orange-500'
                    }`}
                  />
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeOff className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Por favor confirma tu contraseña',
                      validate: (value) =>
                        value === password || 'Las contraseñas no coinciden',
                    })}
                    placeholder="********"
                    className={`w-full px-4 py-3 pl-11 pr-11 bg-slate-700/50 border rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all ${
                      errors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-orange-500'
                    }`}
                  />
                  <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <HiEyeOff className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3.5 bg-gradient-to-b from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </span>
                ) : (
                  'Registrarse'
                )}
              </button>
            </form>

            {/* Link de login */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-center text-sm text-slate-300">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="text-orange-500 hover:text-orange-400 font-semibold transition-colors"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

