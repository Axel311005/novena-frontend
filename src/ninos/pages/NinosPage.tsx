import { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Users, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getNinos, deleteNino } from '../actions';
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

  // Hook de paginación inicial (sin totalItems aún)
  const pagination = useTablePagination(0);

  // Obtener niños con paginación
  const { data: ninosData, isLoading } = useQuery({
    queryKey: ['ninos', pagination.limit, pagination.offset, pagination.searchQuery],
    queryFn: () =>
      getNinos({
        limit: pagination.limit,
        offset: pagination.offset,
        ...(pagination.searchQuery && { q: pagination.searchQuery }),
      }),
  });

  // Procesar datos: puede ser array o objeto paginado
  const { ninos, totalItems } = useMemo(() => {
    if (!ninosData) return { ninos: [], totalItems: 0 };

    if (Array.isArray(ninosData)) {
      return { ninos: ninosData, totalItems: ninosData.length };
    }

    const paginated = ninosData as PaginatedResponse<Nino>;
    return {
      ninos: paginated.data || [],
      totalItems: paginated.total || 0,
    };
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
  const { data: finalNinosData, isLoading: isLoadingFinal } = useQuery({
    queryKey: ['ninos', finalPagination.limit, finalPagination.offset, finalPagination.searchQuery],
    queryFn: () =>
      getNinos({
        limit: finalPagination.limit,
        offset: finalPagination.offset,
        ...(finalPagination.searchQuery && { q: finalPagination.searchQuery }),
      }),
  });

  // Procesar datos finales
  const { ninos: finalNinos, totalItems: finalTotalItems } = useMemo(() => {
    if (!finalNinosData) return { ninos: [], totalItems: 0 };

    if (Array.isArray(finalNinosData)) {
      return { ninos: finalNinosData, totalItems: finalNinosData.length };
    }

    const paginated = finalNinosData as PaginatedResponse<Nino>;
    return {
      ninos: paginated.data || [],
      totalItems: paginated.total || 0,
    };
  }, [finalNinosData]);

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
    queryClient.invalidateQueries({ queryKey: ['ninos'] });
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Niños</h1>
          <p className="text-gray-600 mt-1">Administra la información de los niños</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Agregar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Niños</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {finalNinos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {finalPagination.searchQuery ? 'No se encontraron resultados' : 'Sin niños registrados'}
              </h2>
              <p className="text-gray-600 text-center mb-6">
                {finalPagination.searchQuery
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza agregando el primer niño a la lista de la novena'}
              </p>
              {!finalPagination.searchQuery && (
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
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
                    {finalNinos.map((nino) => (
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
                            {nino.sexo === 'masculino' ? 'Masculino' : 'Femenino'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(nino)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(nino.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
        <NinoForm
          nino={selectedNino}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
}
