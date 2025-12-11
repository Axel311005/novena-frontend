import { useEffect, useState, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { FaSearch, FaChevronDown, FaTimes } from 'react-icons/fa';
import { createAsistencia, updateAsistencia } from '../actions';
import { getNinos } from '@/ninos/actions';
import { useQuery } from '@tanstack/react-query';
import type {
  Asistencia,
  CreateAsistenciaDto,
} from '../types/asistencia.interface';
import type { Nino } from '@/ninos/types/nino.interface';
import type { PaginatedResponse } from '@/shared/types/pagination';

interface AsistenciaFormProps {
  asistencia?: Asistencia | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function AsistenciaForm({
  asistencia,
  onClose,
  onSuccess,
}: AsistenciaFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!asistencia;
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Obtener todos los niños usando la misma estrategia que AsistenciasPage
  const { data: ninosData, isLoading: isLoadingNinos } = useQuery({
    queryKey: ['ninos', 1000, 0, ''],
    queryFn: async () => {
      try {
        const result = await getNinos({ limit: 1000, offset: 0 });
        if (Array.isArray(result)) {
          return result;
        }
        if (result && typeof result === 'object' && 'data' in result) {
          const paginated = result as PaginatedResponse<Nino>;
          return Array.isArray(paginated.data) ? paginated.data : [];
        }
        return [];
      } catch (error) {
        console.error('Error obteniendo niños:', error);
        return [];
      }
    },
  });

  // Procesar datos de niños
  const ninos = useMemo(() => {
    if (!ninosData) return [];
    if (Array.isArray(ninosData)) {
      return ninosData;
    }
    if (ninosData && typeof ninosData === 'object' && 'data' in ninosData) {
      const paginated = ninosData as PaginatedResponse<Nino>;
      return Array.isArray(paginated.data) ? paginated.data : [];
    }
    return [];
  }, [ninosData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
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

  const kidId = watch('kidId');

  // Filtrar niños por búsqueda
  const filteredNinos = useMemo(() => {
    if (!searchQuery.trim()) return ninos;
    const query = searchQuery.toLowerCase().trim();
    return ninos.filter((nino) => {
      const nombreCompleto = [
        nino.primerNombre,
        nino.segundoNombre,
        nino.primerApellido,
        nino.segundoApellido,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return nombreCompleto.includes(query);
    });
  }, [ninos, searchQuery]);

  // Obtener el nombre del niño seleccionado
  const selectedNino = useMemo(() => {
    if (!kidId) return null;
    return ninos.find((n) => n.id === kidId);
  }, [ninos, kidId]);

  const selectedNinoName = useMemo(() => {
    if (!selectedNino) return '';
    return (
      [
        selectedNino.primerNombre,
        selectedNino.segundoNombre,
        selectedNino.primerApellido,
        selectedNino.segundoApellido,
      ]
        .filter(Boolean)
        .join(' ') || 'Sin nombre'
    );
  }, [selectedNino]);

  // Cerrar cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Manejar selección de niño
  const handleSelectNino = (nino: Nino) => {
    setValue('kidId', nino.id, { shouldValidate: true });
    setSearchQuery('');
    setIsOpen(false);
  };

  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsOpen(true);
    if (!value && selectedNino) {
      setValue('kidId', 0, { shouldValidate: true });
    }
  };

  // Limpiar selección
  const handleClear = () => {
    setSearchQuery('');
    setValue('kidId', 0, { shouldValidate: true });
    setIsOpen(false);
  };

  // Calcular altura dinámica del dropdown según resultados
  const dropdownHeight = useMemo(() => {
    // Si no hay búsqueda o hay muchos resultados, usar altura fija por defecto
    const hasSearch = searchQuery.trim().length > 0;
    const resultCount = filteredNinos.length;
    
    // Si no hay búsqueda o hay más de 3 resultados, usar altura fija
    if (!hasSearch || resultCount > 3) {
      // Altura fija por defecto (como estaba antes)
      return 110; // h-[110px] para móvil y tablet
    }
    
    // Si hay búsqueda y pocos resultados (1-3), ajustar al tamaño
    if (resultCount === 0) return 80;
    
    const itemHeight = 40; // altura aproximada de cada item
    const padding = 8; // padding interno reducido
    
    // Si hay solo 1 resultado, hacerlo más compacto
    if (resultCount === 1) {
      return itemHeight + padding; // ~48px
    }
    
    const calculatedHeight = resultCount * itemHeight + padding;
    
    // Mínimo 80px, máximo 200px
    return Math.min(Math.max(calculatedHeight, 80), 200);
  }, [filteredNinos.length, searchQuery]);

  // Calcular margen inferior dinámico
  const bottomMargin = useMemo(() => {
    if (!isOpen) return 0;
    return dropdownHeight + 20; // altura del dropdown + margen
  }, [isOpen, dropdownHeight]);

  // Manejar tecla Enter para seleccionar el primer resultado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredNinos.length > 0) {
      e.preventDefault();
      handleSelectNino(filteredNinos[0]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery(selectedNinoName || '');
    }
  };

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
      // Manejar error personalizado del backend cuando el niño ya tiene asistencia
      if (error?.response?.status === 400 && error?.response?.data?.details) {
        const details = error.response.data.details;
        const errorMessage = error.response.data.message || 'El niño ya tiene un registro de asistencia';
        
        // Construir mensaje detallado sin información técnica
        let detailedMessage = errorMessage;
        if (details.nombre) {
          detailedMessage += `\n\nNiño: ${details.nombre}`;
        }
        detailedMessage += '\n\nPara modificar la asistencia, use la opción de editar en la tabla de asistencias.';
        
        // Mostrar mensaje detallado con información del niño
        toast.error(detailedMessage, {
          duration: 6000, // Mostrar por más tiempo para que se lea toda la información
        });
      } else {
        // Error genérico
        toast.error(error?.response?.data?.message || error?.message || 'Error al registrar la asistencia');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateAsistenciaDto>;
    }) => updateAsistencia(id, data),
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
      <DialogContent className="max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Asistencia' : 'Registrar Asistencia'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
          <div 
            className="transition-all duration-200"
            style={{ marginBottom: isOpen ? `${bottomMargin}px` : '0px' }}
          >
            <Label htmlFor="kidId">Niño *</Label>
            {isLoadingNinos ? (
              <div className="flex h-10 w-full items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50">
                <span className="text-sm text-gray-500">Cargando niños...</span>
              </div>
            ) : (
              <div ref={comboboxRef} className="relative max-w-md">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    ref={inputRef}
                    id="kidId"
                    type="text"
                    placeholder="Buscar y seleccionar niño..."
                    value={isOpen ? searchQuery : selectedNinoName || ''}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      setIsOpen(true);
                      if (!searchQuery && selectedNinoName) {
                        setSearchQuery(selectedNinoName);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isEditing}
                    className="pl-10 pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {selectedNino && !isEditing && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    )}
                    <FaChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
                {isOpen && (
                  <div 
                    className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col"
                    style={{ height: `${dropdownHeight}px` }}
                  >
                    {filteredNinos.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center py-4 text-center text-sm text-gray-500 px-4">
                        {searchQuery.trim()
                          ? 'No se encontraron niños con ese nombre'
                          : 'No hay niños registrados'}
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto p-1">
                        {filteredNinos.map((nino) => {
                          const nombreCompleto =
                            [
                              nino.primerNombre,
                              nino.segundoNombre,
                              nino.primerApellido,
                              nino.segundoApellido,
                            ]
                              .filter(Boolean)
                              .join(' ') || 'Sin nombre';
                          const isSelected = watch('kidId') === nino.id;
                          return (
                            <button
                              key={nino.id}
                              type="button"
                              onClick={() => handleSelectNino(nino)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                isSelected
                                  ? 'bg-orange-100 text-orange-600 font-medium'
                                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                              }`}
                            >
                              {nombreCompleto}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                {errors.kidId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.kidId.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <Label className="mb-3 block">Asistencias por Día</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`day${day}`}
                    {...register(`day${day}` as keyof CreateAsistenciaDto)}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 shrink-0"
                  />
                  <Label
                    htmlFor={`day${day}`}
                    className="text-sm font-medium cursor-pointer whitespace-nowrap"
                  >
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
              {isLoading
                ? 'Guardando...'
                : isEditing
                ? 'Actualizar'
                : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
