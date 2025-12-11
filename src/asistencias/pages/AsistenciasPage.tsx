import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaBell,
  FaTree,
} from 'react-icons/fa';
import { toast } from 'sonner';
import { getAsistencias, deleteAsistencia } from '../actions';
import { getNinos } from '@/ninos/actions';
import { useAuthStore } from '@/auth/store/auth.store';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
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
  const [selectedAsistencia, setSelectedAsistencia] =
    useState<Asistencia | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.roles.includes('admin') ?? false;

  // Hook de paginación inicial
  const pagination = useTablePagination(0);

  // Búsqueda con debounce - inicializar desde URL
  const [searchInput, setSearchInput] = useState(
    () => pagination.searchQuery
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  // Actualizar URL cuando cambia el debounced search
  useEffect(() => {
    if (debouncedSearch !== pagination.searchQuery) {
      pagination.setSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sincronizar searchInput cuando cambia la URL desde fuera (navegación, etc)
  useEffect(() => {
    if (
      pagination.searchQuery !== searchInput &&
      pagination.searchQuery !== debouncedSearch
    ) {
      setSearchInput(pagination.searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.searchQuery]);

  // Query única para obtener asistencias con paginación
  const { data: asistenciasData, isFetching } = useQuery({
    queryKey: [
      'asistencias',
      pagination.limit,
      pagination.offset,
      pagination.searchQuery,
    ],
    queryFn: () =>
      getAsistencias({
        limit: pagination.limit,
        offset: pagination.offset,
        ...(pagination.searchQuery && { q: pagination.searchQuery }),
      }),
  });

  // Obtener todos los niños usando la misma estrategia que NinosPage
  // Usar un límite alto para obtener todos los niños de una vez
  // La queryKey incluye 'ninos' para que se invalide cuando se crean/actualizan niños
  const {
    data: ninosData,
    isLoading: isLoadingNinos,
    error: ninosError,
  } = useQuery({
    queryKey: ['ninos', 1000, 0, ''],
    queryFn: async () => {
      try {
        // Usar un límite alto para obtener todos los niños
        const result = await getNinos({ limit: 1000, offset: 0 });
        // Procesar el resultado: puede ser array o objeto paginado
        if (Array.isArray(result)) {
          return result;
        }
        // Si es objeto paginado, devolver el array de data
        if (result && typeof result === 'object' && 'data' in result) {
          const paginated = result as PaginatedResponse<any>;
          return Array.isArray(paginated.data) ? paginated.data : [];
        }
        return [];
      } catch (error) {
        console.error('Error obteniendo niños:', error);
        return [];
      }
    },
  });

  // Procesar datos de asistencias: mantener el orden exacto que viene del backend
  const { asistencias, totalItems } = useMemo(() => {
    if (!asistenciasData) return { asistencias: [], totalItems: 0 };

    if (Array.isArray(asistenciasData)) {
      return {
        asistencias: asistenciasData,
        totalItems: asistenciasData.length,
      };
    }

    const paginated = asistenciasData as PaginatedResponse<Asistencia>;
    return {
      asistencias: paginated.data || [],
      totalItems: paginated.total || 0,
    };
  }, [asistenciasData]);

  // Procesar datos de niños - puede ser array o objeto paginado
  const ninos = useMemo(() => {
    if (!ninosData) return [];
    // Si es array, devolverlo directamente
    if (Array.isArray(ninosData)) {
      return ninosData;
    }
    // Si es objeto paginado, extraer el array de data
    if (ninosData && typeof ninosData === 'object' && 'data' in ninosData) {
      const paginated = ninosData as PaginatedResponse<any>;
      return Array.isArray(paginated.data) ? paginated.data : [];
    }
    return [];
  }, [ninosData]);

  // Actualizar paginación con totalItems real para los controles
  const finalPagination = useTablePagination(totalItems);

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

  // Mostrar loading mientras se cargan los niños
  if (isLoadingNinos) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Mostrar error si hay un error cargando los niños
  if (ninosError) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <p className="text-red-600">
              Error al cargar los niños: {String(ninosError)}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Solo mostrar "Sin niños" si ya se cargaron los datos y no hay niños
  if (!isLoadingNinos && !ninosError && ninos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <FaTree className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sin niños registrados
            </h2>
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


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Control de Asistencias
          </h1>
          <p className="text-gray-600 mt-1">
            Registra y gestiona las asistencias de los niños
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <FaPlus className="w-5 h-5 mr-2" />
          Registrar Asistencia
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Asistencias</CardTitle>
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o edad..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    pagination.setSearch(searchInput);
                  }
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative">
          {isFetching && asistencias.length > 0 && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-100 overflow-hidden z-10">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 animate-pulse"
                style={{ width: '100%' }}
              />
            </div>
          )}
          {asistencias.length === 0 && !isFetching ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <FaBell className="w-16 h-16 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {pagination.searchQuery
                  ? 'No se encontraron resultados'
                  : 'No hay asistencias registradas'}
              </h3>
              <p className="text-gray-600 mb-4">
                {pagination.searchQuery
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza registrando la primera asistencia'}
              </p>
              {!pagination.searchQuery && (
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <FaPlus className="w-5 h-5 mr-2" />
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
                      <TableHead className="text-center">Edad</TableHead>
                      <TableHead className="text-center">
                        Días Asistidos
                      </TableHead>
                      {Array.from({ length: 9 }).map((_, i) => (
                        <TableHead
                          key={`day-header-${i + 1}`}
                          className="text-center"
                        >
                          Día {i + 1}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asistencias.map((asistencia) => {
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
                            {nino ? (
                              <span className="text-sm text-gray-700">
                                {nino.edad} {nino.edad === 1 ? 'año' : 'años'}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {diasAsistidos}/9
                            </span>
                          </TableCell>
                          {Array.from({ length: 9 }).map((_, i) => (
                            <TableCell
                              key={`day-status-${asistencia.id}-${i + 1}`}
                              className="text-center"
                            >
                              {asistencia[`day${i + 1}` as keyof Asistencia] ? (
                                <FaCheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <FaTimesCircle className="w-5 h-5 text-red-500 mx-auto" />
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
                                <FaEdit className="w-4 h-4" />
                              </Button>
                              {isAdmin && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(asistencia.id)}
                                >
                                  <FaTrash className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {totalItems > 0 && (
                <PaginationControls
                  currentPage={finalPagination.page}
                  totalPages={finalPagination.totalPages}
                  itemsPerPage={finalPagination.limit}
                  totalItems={totalItems}
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
