import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, Edit, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getAsistencias, deleteAsistencia } from '../actions';
import { getNinos } from '@/ninos/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { AsistenciaForm } from '../components/AsistenciaForm';
import type { Asistencia } from '../types/asistencia.interface';
import { useTablePagination } from '@/shared/hooks/useTablePagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { PaginationControls } from '@/shared/components/PaginationControls';
import type { PaginatedResponse } from '@/shared/types/pagination';

export default function AsistenciasPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAsistencia, setSelectedAsistencia] = useState<Asistencia | null>(null);
  const queryClient = useQueryClient();

  // Hook de paginación inicial
  const pagination = useTablePagination(0);

  // Obtener asistencias con paginación
  const { data: asistenciasData, isLoading: isLoadingAsistencias } = useQuery({
    queryKey: ['asistencias', pagination.limit, pagination.offset, pagination.searchQuery],
    queryFn: () =>
      getAsistencias({
        limit: pagination.limit,
        offset: pagination.offset,
        ...(pagination.searchQuery && { q: pagination.searchQuery }),
      }),
  });

  // Obtener todos los niños (sin paginación) para mostrar nombres
  const { data: ninosData } = useQuery({
    queryKey: ['ninos'],
    queryFn: () => getNinos(),
  });

  // Procesar datos de asistencias
  const { asistencias, totalItems } = useMemo(() => {
    if (!asistenciasData) return { asistencias: [], totalItems: 0 };

    if (Array.isArray(asistenciasData)) {
      return { asistencias: asistenciasData, totalItems: asistenciasData.length };
    }

    const paginated = asistenciasData as PaginatedResponse<Asistencia>;
    return {
      asistencias: paginated.data || [],
      totalItems: paginated.total || 0,
    };
  }, [asistenciasData]);

  // Procesar datos de niños
  const ninos = useMemo(() => {
    if (!ninosData) return [];
    if (Array.isArray(ninosData)) return ninosData;
    const paginated = ninosData as PaginatedResponse<any>;
    return paginated.data || [];
  }, [ninosData]);

  // Recalcular paginación con totalItems real
  const finalPagination = useTablePagination(totalItems);

  // Búsqueda con debounce - inicializar desde URL
  const [searchInput, setSearchInput] = useState(() => finalPagination.searchQuery);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Actualizar URL cuando cambia el debounced search
  useEffect(() => {
    if (debouncedSearch !== finalPagination.searchQuery) {
      finalPagination.setSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sincronizar searchInput cuando cambia la URL desde fuera (navegación, etc)
  useEffect(() => {
    if (finalPagination.searchQuery !== searchInput && finalPagination.searchQuery !== debouncedSearch) {
      setSearchInput(finalPagination.searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalPagination.searchQuery]);

  // Query con los valores finales de paginación
  const { data: finalAsistenciasData, isLoading: isLoadingFinal } = useQuery({
    queryKey: ['asistencias', finalPagination.limit, finalPagination.offset, finalPagination.searchQuery],
    queryFn: () =>
      getAsistencias({
        limit: finalPagination.limit,
        offset: finalPagination.offset,
        ...(finalPagination.searchQuery && { q: finalPagination.searchQuery }),
      }),
  });

  // Procesar datos finales
  const { asistencias: finalAsistencias, totalItems: finalTotalItems } = useMemo(() => {
    if (!finalAsistenciasData) return { asistencias: [], totalItems: 0 };

    if (Array.isArray(finalAsistenciasData)) {
      return { asistencias: finalAsistenciasData, totalItems: finalAsistenciasData.length };
    }

    const paginated = finalAsistenciasData as PaginatedResponse<Asistencia>;
    return {
      asistencias: paginated.data || [],
      totalItems: paginated.total || 0,
    };
  }, [finalAsistenciasData]);

  const deleteMutation = useMutation({
    mutationFn: deleteAsistencia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asistencias'] });
      toast.success('Asistencia eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al eliminar la asistencia');
    },
  });

  const handleEdit = (asistencia: Asistencia) => {
    setSelectedAsistencia(asistencia);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta asistencia?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedAsistencia(null);
    queryClient.invalidateQueries({ queryKey: ['asistencias'] });
  };

  // Función para contar días asistidos
  const getDiasAsistidos = (asistencia: Asistencia) => {
    const dias = [
      asistencia.day1,
      asistencia.day2,
      asistencia.day3,
      asistencia.day4,
      asistencia.day5,
      asistencia.day6,
      asistencia.day7,
      asistencia.day8,
      asistencia.day9,
    ];
    return dias.filter(Boolean).length;
  };

  if (ninos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin niños registrados</h2>
            <p className="text-gray-600 text-center mb-6">
              Primero debes agregar niños para registrar sus asistencias
            </p>
            <Button
              onClick={() => (window.location.href = '/admin/ninos')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Ir a Gestión de Niños
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingFinal) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Control de Asistencias</h1>
          <p className="text-gray-600 mt-1">Registra y gestiona las asistencias de los niños</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Registrar Asistencia
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Asistencias</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre del niño..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {finalAsistencias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <Calendar className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {finalPagination.searchQuery ? 'No se encontraron resultados' : 'No hay asistencias registradas'}
              </h3>
              <p className="text-gray-600 mb-4">
                {finalPagination.searchQuery
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza registrando la primera asistencia'}
              </p>
              {!finalPagination.searchQuery && (
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Registrar Primera Asistencia
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Niño</TableHead>
                      <TableHead className="text-center">Días Asistidos</TableHead>
                      {Array.from({ length: 9 }).map((_, i) => (
                        <TableHead key={`day-header-${i + 1}`} className="text-center">
                          Día {i + 1}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {finalAsistencias.map((asistencia) => {
                      const nino = ninos.find((n) => n.id === asistencia.kidId);
                      const diasAsistidos = getDiasAsistidos(asistencia);
                      return (
                        <TableRow key={asistencia.id}>
                          <TableCell className="font-medium">
                            {nino
                              ? [
                                  nino.primerNombre,
                                  nino.segundoNombre,
                                  nino.primerApellido,
                                  nino.segundoApellido,
                                ]
                                  .filter(Boolean)
                                  .join(' ') || 'Sin nombre'
                              : `ID: ${asistencia.kidId}`}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {diasAsistidos}/9
                            </span>
                          </TableCell>
                          {Array.from({ length: 9 }).map((_, i) => (
                            <TableCell key={`day-status-${asistencia.id}-${i + 1}`} className="text-center">
                              {asistencia[`day${i + 1}` as keyof Asistencia] ? (
                                <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                              )}
                            </TableCell>
                          ))}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(asistencia)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(asistencia.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {finalTotalItems > 0 && (
                <PaginationControls
                  currentPage={finalPagination.page}
                  totalPages={finalPagination.totalPages}
                  itemsPerPage={finalPagination.limit}
                  totalItems={finalTotalItems}
                  onPageChange={finalPagination.setPage}
                  onLimitChange={finalPagination.setLimit}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <AsistenciaForm
          asistencia={selectedAsistencia}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
}
