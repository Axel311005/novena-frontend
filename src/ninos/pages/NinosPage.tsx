import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSnowflake } from 'react-icons/fa';
import { toast } from 'sonner';
import { getNinos, deleteNino } from '../actions';
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
import { NinoForm } from '../components/NinoForm';
import type { Nino } from '../types/nino.interface';
import { useTablePagination } from '@/shared/hooks/useTablePagination';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { PaginationControls } from '@/shared/components/PaginationControls';
import type { PaginatedResponse } from '@/shared/types/pagination';

export default function NinosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNino, setSelectedNino] = useState<Nino | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.roles.includes('admin') ?? false;

  // Hook de paginación - inicializar con 0, se actualizará cuando tengamos los datos
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

  // Query única para obtener niños con paginación
  const { data: ninosData, isFetching } = useQuery({
    queryKey: [
      'ninos',
      pagination.limit,
      pagination.offset,
      pagination.searchQuery,
    ],
    queryFn: () =>
      getNinos({
        limit: pagination.limit,
        offset: pagination.offset,
        ...(pagination.searchQuery && { q: pagination.searchQuery }),
      }),
  });

  // Procesar datos: mantener el orden exacto que viene del backend (sin modificar el orden)
  const { ninos, totalItems } = useMemo(() => {
    if (!ninosData) return { ninos: [], totalItems: 0 };

    // Si es un array directo (sin paginación)
    if (Array.isArray(ninosData)) {
      return { 
        ninos: ninosData, // Mantener orden original del backend - NO modificar
        totalItems: ninosData.length 
      };
    }

    // Si es un objeto paginado
    const paginated = ninosData as PaginatedResponse<Nino>;
    // Asegurar que el array data mantenga el orden exacto del backend
    const dataArray = paginated.data || [];
    
    return {
      ninos: dataArray, // Mantener orden original del backend - NO modificar
      totalItems: paginated.total || 0,
    };
  }, [ninosData]);

  // Actualizar paginación con totalItems real para los controles
  const finalPagination = useTablePagination(totalItems);

  const deleteMutation = useMutation({
    mutationFn: deleteNino,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ninos'] });
      toast.success('Niño eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al eliminar el niño');
    },
  });

  const handleEdit = (nino: Nino) => {
    setSelectedNino(nino);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este niño?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedNino(null);
    // Invalidar y refetch para obtener datos frescos con el orden correcto
    queryClient.invalidateQueries({ queryKey: ['ninos'] });
    queryClient.refetchQueries({ queryKey: ['ninos'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Niños</h1>
          <p className="text-gray-600 mt-1">
            Administra la información de los niños
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <FaPlus className="w-5 h-5 mr-2" />
          Agregar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Niños</CardTitle>
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre..."
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
          {isFetching && ninos.length > 0 && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-100 overflow-hidden z-10">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 animate-pulse"
                style={{ width: '100%' }}
              />
            </div>
          )}
          {ninos.length === 0 && !isFetching ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center mb-4">
                <FaSnowflake className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {pagination.searchQuery
                  ? 'No se encontraron resultados'
                  : 'Sin niños registrados'}
              </h2>
              <p className="text-sm text-gray-500 text-center max-w-md">
                {pagination.searchQuery
                  ? `No hay niños que coincidan con "${pagination.searchQuery}". Intenta con otros términos de búsqueda.`
                  : 'Comienza agregando el primer niño a la lista de la novena'}
              </p>
              {!pagination.searchQuery && (
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <FaPlus className="w-5 h-5 mr-2" />
                  Agregar Primer Niño
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre Completo</TableHead>
                      <TableHead>Edad</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ninos.map((nino) => (
                      <TableRow key={nino.id}>
                        <TableCell className="font-medium">
                          {[
                            nino.primerNombre,
                            nino.segundoNombre,
                            nino.primerApellido,
                            nino.segundoApellido,
                          ]
                            .filter(Boolean)
                            .join(' ') || 'Sin nombre'}
                        </TableCell>
                        <TableCell>{nino.edad} años</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {nino.sexo === 'masculino'
                              ? 'Masculino'
                              : 'Femenino'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(nino)}
                            >
                              <FaEdit className="w-4 h-4" />
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(nino.id)}
                              >
                                <FaTrash className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
        <NinoForm
          nino={selectedNino}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
}
