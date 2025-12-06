import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limitOptions?: number[];
}

export function PaginationControls({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 30, 50, 100],
}: PaginationControlsProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Calcular totalPages correctamente
  const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < calculatedTotalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50 border-t border-gray-200">
      {/* Información de registros */}
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        Mostrando <span className="font-semibold text-gray-900">{startItem}</span> a{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> de{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> registros
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
        {/* Selector de límite */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Mostrar:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => onLimitChange(parseInt(value, 10))}
          >
            <SelectTrigger className="h-9 w-20 bg-white border-2 border-gray-300 text-gray-900 hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 shadow-xl">
              {limitOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={String(option)}
                  className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer text-gray-900"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            className="h-9 px-2 sm:px-3 border-2 disabled:opacity-50"
            aria-label="Primera página"
          >
            <ChevronsLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="h-9 px-2 sm:px-3 border-2 disabled:opacity-50"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          {/* Indicador de página */}
          <div className="px-3 sm:px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-md min-w-[80px] text-center">
            {currentPage} / {calculatedTotalPages}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="h-9 px-2 sm:px-3 border-2 disabled:opacity-50"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(calculatedTotalPages)}
            disabled={!canGoNext}
            className="h-9 px-2 sm:px-3 border-2 disabled:opacity-50"
            aria-label="Última página"
          >
            <ChevronsRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

