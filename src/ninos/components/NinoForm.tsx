import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { createNino, updateNino } from '../actions';
import type { Nino, CreateNinoDto } from '../types/nino.interface';

interface NinoFormProps {
  nino?: Nino | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function NinoForm({ nino, onClose, onSuccess }: NinoFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!nino;
  const [edadValue, setEdadValue] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateNinoDto>({
    defaultValues: {
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      edad: undefined as any,
      sexo: 'masculino',
    },
  });

  const edad = watch('edad');

  useEffect(() => {
    if (nino) {
      const edadStr = nino.edad ? String(nino.edad) : '';
      setEdadValue(edadStr);
      reset({
        primerNombre: nino.primerNombre ?? '',
        segundoNombre: nino.segundoNombre ?? '',
        primerApellido: nino.primerApellido ?? '',
        segundoApellido: nino.segundoApellido ?? '',
        edad: nino.edad || undefined as any,
        sexo: nino.sexo || 'masculino',
      });
    } else {
      setEdadValue('');
      reset({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        edad: undefined as any,
        sexo: 'masculino',
      });
    }
  }, [nino, reset]);

  // Manejar cambio en el campo de edad
  const handleEdadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Permitir borrar todo (campo vacío)
    if (value === '') {
      setEdadValue('');
      setValue('edad', undefined as any, { shouldValidate: true });
      return;
    }

    // Prevenir signo menos y caracteres no numéricos
    if (value.includes('-') || isNaN(Number(value))) {
      return;
    }

    const numValue = Number(value);
    
    // Prevenir 0
    if (numValue === 0) {
      return;
    }

    // Solo permitir números positivos
    if (numValue > 0) {
      setEdadValue(value);
      setValue('edad', numValue, { shouldValidate: true });
    }
  };

  // Prevenir teclas no deseadas
  const handleEdadKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevenir signo menos, punto, y otros caracteres no deseados
    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.') {
      e.preventDefault();
    }
  };

  const createMutation = useMutation({
    mutationFn: createNino,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ninos'] });
      toast.success('Niño creado exitosamente');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al crear el niño');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateNinoDto }) => updateNino(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ninos'] });
      toast.success('Niño actualizado exitosamente');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al actualizar el niño');
    },
  });

  const onSubmit = (data: CreateNinoDto) => {
    // Convertir strings vacíos a null para campos opcionales
    const processedData: CreateNinoDto = {
      ...data,
      primerNombre: data.primerNombre?.trim() || null,
      segundoNombre: data.segundoNombre?.trim() || null,
      primerApellido: data.primerApellido?.trim() || null,
      segundoApellido: data.segundoApellido?.trim() || null,
    };

    if (isEditing && nino) {
      updateMutation.mutate({ id: nino.id, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Niño' : 'Agregar Niño'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primerNombre">Primer Nombre</Label>
              <Input
                id="primerNombre"
                {...register('primerNombre')}
                placeholder="Primer nombre (opcional)"
              />
              {errors.primerNombre && (
                <p className="text-sm text-red-500 mt-1">{errors.primerNombre.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="segundoNombre">Segundo Nombre</Label>
              <Input
                id="segundoNombre"
                {...register('segundoNombre')}
                placeholder="Segundo nombre (opcional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primerApellido">Primer Apellido</Label>
              <Input
                id="primerApellido"
                {...register('primerApellido')}
                placeholder="Primer apellido (opcional)"
              />
              {errors.primerApellido && (
                <p className="text-sm text-red-500 mt-1">{errors.primerApellido.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="segundoApellido">Segundo Apellido</Label>
              <Input
                id="segundoApellido"
                {...register('segundoApellido')}
                placeholder="Segundo apellido (opcional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edad">Edad *</Label>
              <Input
                id="edad"
                type="number"
                min="1"
                value={edadValue}
                onChange={handleEdadChange}
                onKeyDown={handleEdadKeyDown}
                placeholder="Edad en años"
              />
              <input
                type="hidden"
                {...register('edad', { 
                  required: 'La edad es requerida',
                  valueAsNumber: true,
                  min: { value: 1, message: 'La edad debe ser mayor a 0' },
                  validate: (value) => {
                    if (!value || value === 0 || value < 1) {
                      return 'La edad debe ser mayor a 0';
                    }
                    return true;
                  }
                })}
                value={edad || ''}
              />
              {errors.edad && (
                <p className="text-sm text-red-500 mt-1">{errors.edad.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="sexo">Sexo *</Label>
              <select
                id="sexo"
                {...register('sexo', { required: 'El sexo es requerido' })}
                className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </select>
              {errors.sexo && (
                <p className="text-sm text-red-500 mt-1">{errors.sexo.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

