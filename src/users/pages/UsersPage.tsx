import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Plus, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { createUser } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { UserForm } from '../components/UserForm';

export default function UsersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('Usuario creado exitosamente');
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Error al crear el usuario');
    },
  });

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Crea y administra usuarios del sistema</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Crear Usuario
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <UserPlus className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Nuevo Usuario</h2>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Utiliza el botón "Crear Usuario" para agregar nuevos usuarios al sistema.
            Solo los administradores pueden crear usuarios.
          </p>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Usuario
          </Button>
        </CardContent>
      </Card>

      {isFormOpen && (
        <UserForm
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
}

