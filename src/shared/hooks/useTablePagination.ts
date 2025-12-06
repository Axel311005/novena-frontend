import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';

export interface UseTablePaginationOptions {
  defaultLimit?: number;
  defaultPage?: number;
}

export interface UseTablePaginationReturn {
  // Valores actuales
  limit: number;
  page: number;
  offset: number;
  searchQuery: string;
  
  // Valores calculados
  totalPages: number;
  
  // Funciones
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (query: string) => void;
  resetPagination: () => void;
}

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const VALID_LIMITS = [10, 30, 50, 100];

/**
 * Hook general para manejar paginación en tablas
 * Maneja limit, offset, page y búsqueda de forma consistente
 */
export const useTablePagination = (
  totalItems: number = 0,
  options: UseTablePaginationOptions = {}
): UseTablePaginationReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
  const defaultPage = options.defaultPage ?? DEFAULT_PAGE;

  // Leer valores de URL
  const limit = useMemo(() => {
    const limitParam = searchParams.get('limit');
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      // Validar que sea uno de los límites permitidos
      if (VALID_LIMITS.includes(parsed)) {
        return parsed;
      }
    }
    return defaultLimit;
  }, [searchParams, defaultLimit]);

  const page = useMemo(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      return parsed > 0 ? parsed : defaultPage;
    }
    return defaultPage;
  }, [searchParams, defaultPage]);

  const searchQuery = useMemo(
    () => searchParams.get('q') || '',
    [searchParams]
  );

  // Calcular offset: offset = (page - 1) * limit
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    if (totalItems === 0) return 1;
    return Math.max(1, Math.ceil(totalItems / limit));
  }, [totalItems, limit]);

  // Función para cambiar página
  const setPage = useCallback(
    (newPage: number) => {
      const newParams = new URLSearchParams(searchParams);
      
      if (newPage <= 1) {
        newParams.delete('page');
      } else {
        // Validar que la página no exceda el total
        const maxPage = Math.max(1, totalPages);
        const validPage = Math.min(newPage, maxPage);
        if (validPage > 1) {
          newParams.set('page', String(validPage));
        } else {
          newParams.delete('page');
        }
      }
      
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams, totalPages]
  );

  // Función para cambiar limit
  const setLimit = useCallback(
    (newLimit: number) => {
      // Validar que sea uno de los límites permitidos
      if (!VALID_LIMITS.includes(newLimit)) {
        return;
      }

      const newParams = new URLSearchParams(searchParams);
      newParams.set('limit', String(newLimit));

      // Recalcular la página actual cuando cambia el limit
      const currentOffset = offset;
      const newPage = Math.ceil((currentOffset + 1) / newLimit);
      const maxPage = Math.ceil(totalItems / newLimit) || 1;
      const validPage = Math.min(newPage, maxPage);

      if (validPage <= 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', String(validPage));
      }

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams, offset, totalItems]
  );

  // Función para cambiar búsqueda (resetea a página 1)
  const setSearch = useCallback(
    (query: string) => {
      const newParams = new URLSearchParams(searchParams);
      
      if (query.trim()) {
        newParams.set('q', query.trim());
      } else {
        newParams.delete('q');
      }
      
      // Resetear a página 1 cuando se busca
      newParams.delete('page');
      
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Función para resetear paginación
  const resetPagination = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('page');
    newParams.delete('q');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return {
    limit,
    page,
    offset,
    searchQuery,
    totalPages,
    setPage,
    setLimit,
    setSearch,
    resetPagination,
  };
};

