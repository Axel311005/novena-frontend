import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { createAsistencia, updateAsistencia } from '../actions';
import { getNinos } from '@/ninos/actions';
import { useQuery } from '@tanstack/react-query';
import type { Asistencia, CreateAsistenciaDto } from '../types/asistencia.interface';

interface AsistenciaFormProps {
  asistencia?: Asistencia | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AsistenciaForm({ asistencia, onClose, onSuccess }: AsistenciaFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!asistencia;

  const { data: ninos = [] } = useQuery({
    queryKey: ['ninos'],
    queryFn: getNinos,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAsistenciaDto>({
    defaultValues: {
      kidId: 0,
      day1: false,
      day2: false,
      day3: false,
      day4: false,
      day5: false,
      day6: false,
      day7: false,
      day8: false,
      day9: false,
    },
  });

  useEffect(() => {
    if (asistencia) {
      reset({
        kidId: asistencia.kidId,
        day1: asistencia.day1 || false,
        day2: asistencia.day2 || false,
        day3: asistencia.day3 || false,
        day4: asistencia.day4 || false,
        day5: asistencia.day5 || false,
        day6: asistencia.day6 || false,
        day7: asistencia.day7 || false,
        day8: asistencia.day8 || false,
        day9: asistencia.day9 || false,
      });
    } else {
      reset({
        kidId: 0,
        day1: false,
        day2: false,
        day3: false,
        day4: false,
        day5: false,
        day6: false,
        day7: false,
        day8: false,
        day9: false,
      });
    }
  }, [asistencia, reset]);

  const createMutation = useMutation({
    mutationFn: createAsistencia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asistencias'] });
      toast.success('Asistencia registrada exitosamente');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al registrar la asistencia');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateAsistenciaDto> }) =>
      updateAsistencia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asistencias'] });
      toast.success('Asistencia actualizada exitosamente');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al actualizar la asistencia');
    },
  });

  const onSubmit = (data: CreateAsistenciaDto) => {
    if (isEditing && asistencia) {
      updateMutation.mutate({ id: asistencia.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Asistencia' : 'Registrar Asistencia'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="kidId">Niño *</Label>
            <select
              id="kidId"
              {...register('kidId', {
                required: 'Debes seleccionar un niño',
                valueAsNumber: true,
              })}
              className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500"
              disabled={isEditing}
            >
              <option value={0}>Selecciona un niño</option>
              {ninos.map((nino) => {
                const nombreCompleto = [
                  nino.primerNombre,
                  nino.segundoNombre,
                  nino.primerApellido,
                  nino.segundoApellido,
                ]
                  .filter(Boolean)
                  .join(' ') || 'Sin nombre';
                return (
                  <option key={nino.id} value={nino.id}>
                    {nombreCompleto}
                  </option>
                );
              })}
            </select>
            {errors.kidId && (
              <p className="text-sm text-red-500 mt-1">{errors.kidId.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-3 block">Asistencias por Día</Label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`day${day}`}
                    {...register(`day${day}` as keyof CreateAsistenciaDto)}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <Label htmlFor={`day${day}`} className="text-sm font-medium cursor-pointer">
                    Día {day}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
