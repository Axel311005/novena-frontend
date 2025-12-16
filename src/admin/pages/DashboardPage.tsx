import { useQuery } from '@tanstack/react-query';
import {
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaChartLine,
  FaCalendarDay,
  FaChartBar,
  FaMale,
  FaFemale,
} from 'react-icons/fa';
import { getDashboardStats, getStatsByDay, getStatsByAge, getStatsBySex } from '@/stats/actions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

export default function DashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const { data: statsByDay, isLoading: isLoadingByDay } = useQuery({
    queryKey: ['stats-by-day'],
    queryFn: getStatsByDay,
  });

  const { data: statsByAge, isLoading: isLoadingByAge } = useQuery({
    queryKey: ['stats-by-age'],
    queryFn: getStatsByAge,
  });

  const { data: statsBySex, isLoading: isLoadingBySex, error: errorBySex } = useQuery({
    queryKey: ['stats-by-sex'],
    queryFn: getStatsBySex,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isLoading = isLoadingStats || isLoadingByDay || isLoadingByAge;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen de la gestión de la novena</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Niños
            </CardTitle>
            <FaUsers className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKids}</div>
            <p className="text-xs text-gray-600">Niños registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registros de Asistencia
            </CardTitle>
            <FaCalendarAlt className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAsistencias}</div>
            <p className="text-xs text-gray-600">Registros totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Niños con Asistencia
            </CardTitle>
            <FaCheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.kidsWithAttendance}
            </div>
            <p className="text-xs text-gray-600">
              Niños con al menos un registro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio de Días
            </CardTitle>
            <FaChartLine className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.averageDays}
            </div>
            <p className="text-xs text-gray-600">
              Días asistidos por niño (promedio)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas de estadísticas por género */}
      {statsBySex && statsBySex.bySexArray && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Distribución por Género
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statsBySex.bySexArray.map((sexData) => {
              const isMasculino = sexData.sexo === 'masculino';
              return (
                <Card key={sexData.sexo}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isMasculino ? 'Niños' : 'Niñas'}
                    </CardTitle>
                    {isMasculino ? (
                      <FaMale className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FaFemale className="h-5 w-5 text-pink-500" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${isMasculino ? 'text-blue-600' : 'text-pink-600'}`}>
                      {sexData.count}
                    </div>
                    <p className="text-xs text-gray-600">
                      {sexData.count === 1 
                        ? (isMasculino ? 'niño' : 'niña')
                        : (isMasculino ? 'niños' : 'niñas')}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Tarjetas de asistencia por día */}
      {statsByDay && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Asistencia por Día
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statsByDay.byDayArray.map((dayData) => (
              <Card key={dayData.day}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Día {dayData.dayNumber}
                  </CardTitle>
                  <FaCalendarDay className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {dayData.count}
                  </div>
                  <p className="text-xs text-gray-600">
                    {dayData.count === 1 ? 'niño asistió' : 'niños asistieron'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tarjetas de estadísticas por edad */}
      {statsByAge && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Distribución por Edad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statsByAge.byAgeArray.map((ageData) => (
              <Card key={ageData.edad}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {ageData.edad} {ageData.edad === 1 ? 'año' : 'años'}
                  </CardTitle>
                  <FaChartBar className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {ageData.count}
                  </div>
                  <p className="text-xs text-gray-600">
                    {ageData.count === 1 ? 'niño' : 'niños'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Sistema de gestión de asistencias para la Novena del Niño Dios.
            Utiliza el menú lateral para navegar entre las diferentes secciones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
