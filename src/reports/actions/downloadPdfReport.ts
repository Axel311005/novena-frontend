import { novenaApi } from '@/shared/api/novenaApi';

export const downloadPdfReport = async (): Promise<void> => {
  try {
    const response = await novenaApi.get('/reports/pdf', {
      responseType: 'blob',
    });

    // Verificar si la respuesta es realmente un PDF o un error JSON
    if (response.data.type === 'application/json') {
      // Si es JSON, significa que hubo un error
      const text = await response.data.text();
      const errorData = JSON.parse(text);
      throw new Error(errorData.message || 'Error al generar el reporte PDF');
    }

    // Verificar que el tamaño del blob sea razonable (más de 0 bytes)
    if (response.data.size === 0) {
      throw new Error('El archivo PDF está vacío');
    }

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte-asistencias.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Limpiar el URL después de un tiempo
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error: any) {
    // Si el error es de conexión
    if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000');
    }
    
    // Si el error tiene respuesta del servidor
    if (error?.response?.data) {
      // Si es un blob que contiene JSON (error)
      if (error.response.data instanceof Blob && error.response.data.type === 'application/json') {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || 'Error al generar el reporte PDF');
      }
      
      // Si es un objeto JSON directo
      if (typeof error.response.data === 'object' && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    // Error genérico
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Error al descargar el reporte PDF. Por favor, intenta nuevamente.');
  }
};

