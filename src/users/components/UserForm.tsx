import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { createUser } from '../actions';
import type { CreateUserDto } from '../types/user.interface';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useState } from 'react';

interface UserFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function UserForm({ onClose, onSuccess }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('Usuario creado exitosamente');
      onSuccess();
    },
    onError: (error: any) => {
      let errorMessage = 'Error al crear el usuario. Por favor, intenta nuevamente.';

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
    },
  });

  const onSubmit = (data: CreateUserDto) => {
    createMutation.mutate(data);
  };

  const isLoading = createMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico *</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]{6,}@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'El correo debe tener al menos 6 caracteres antes del @',
                  },
                })}
                placeholder="correo@ejemplo.com"
                className={`w-full pl-11 ${
                  errors.email ? 'border-red-400 focus:border-red-400' : ''
                }`}
              />
              <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Contraseña *</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                  maxLength: {
                    value: 50,
                    message: 'La contraseña no puede exceder 50 caracteres',
                  },
                  pattern: {
                    value: /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                    message: 'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
                  },
                })}
                placeholder="********"
                className={`w-full pl-11 pr-11 ${
                  errors.password ? 'border-red-400 focus:border-red-400' : ''
                }`}
              />
              <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password.message}</p>
            )}
            <p className="mt-1.5 text-xs text-gray-500">
              La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

