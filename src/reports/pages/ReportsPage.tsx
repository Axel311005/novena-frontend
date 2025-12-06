import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FaGift, FaDownload, FaSpinner, FaFileAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import { downloadPdfReport, downloadExcelReport } from '../actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export default function ReportsPage() {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const pdfMutation = useMutation({
    mutationFn: downloadPdfReport,
    onSuccess: () => {
      toast.success('Reporte PDF descargado exitosamente');
      setDownloadingPdf(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al descargar el reporte PDF');
      setDownloadingPdf(false);
    },
  });

  const excelMutation = useMutation({
    mutationFn: downloadExcelReport,
    onSuccess: () => {
      toast.success('Reporte Excel descargado exitosamente');
      setDownloadingExcel(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al descargar el reporte Excel');
      setDownloadingExcel(false);
    },
  });

  const handleDownloadPdf = () => {
    setDownloadingPdf(true);
    pdfMutation.mutate();
  };

  const handleDownloadExcel = () => {
    setDownloadingExcel(true);
    excelMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-1">
          Genera y descarga reportes de asistencias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <FaGift className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <CardTitle>Reporte PDF</CardTitle>
                <CardDescription>
                  Descarga un reporte completo en formato PDF
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Genera un reporte detallado de todas las asistencias en formato
              PDF, ideal para impresión y archivo.
            </p>
            <Button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || downloadingExcel}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              {downloadingPdf ? (
                <>
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <FaDownload className="w-4 h-4 mr-2" />
                  Descargar PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FaFileAlt className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Reporte Excel</CardTitle>
                <CardDescription>
                  Descarga un reporte completo en formato Excel
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Genera un reporte detallado de todas las asistencias en formato
              Excel, ideal para análisis y manipulación de datos.
            </p>
            <Button
              onClick={handleDownloadExcel}
              disabled={downloadingPdf || downloadingExcel}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {downloadingExcel ? (
                <>
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <FaDownload className="w-4 h-4 mr-2" />
                  Descargar Excel
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Los reportes incluyen información completa de todos los niños
            registrados y sus asistencias. Puedes descargar los reportes en
            formato PDF para impresión o en formato Excel para análisis de
            datos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
