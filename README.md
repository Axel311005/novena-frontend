# Novena del Niño Dios - Frontend

Sistema de gestión de asistencias para la Novena del Niño Dios. Este frontend está construido con React, TypeScript, Vite y Tailwind CSS.

## 🚀 Características

- **Autenticación JWT**: Sistema completo de login y registro de usuarios
- **Gestión de Niños**: CRUD completo para registrar y gestionar información de los niños
- **Control de Asistencias**: Registro y modificación de asistencias diarias
- **Dashboard**: Vista general con estadísticas y resumen
- **Diseño Moderno**: Interfaz limpia y moderna basada en las especificaciones de diseño

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend API corriendo (ver configuración de `VITE_API_URL`)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd novena-frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` y configura la URL de tu API:
```
VITE_API_URL=http://localhost:3000
```

## 🚀 Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Build para Producción

Para crear una build de producción:

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## 🏗️ Estructura del Proyecto

```
src/
├── admin/          # Páginas del dashboard
├── auth/           # Autenticación (login, registro, store)
├── ninos/          # Módulo de gestión de niños
│   ├── actions/    # Acciones para CRUD
│   ├── api/        # Llamadas a la API
│   ├── components/ # Componentes específicos
│   ├── pages/      # Páginas del módulo
│   └── types/      # Interfaces TypeScript
├── asistencias/    # Módulo de gestión de asistencias
│   ├── actions/    # Acciones para CRUD
│   ├── api/        # Llamadas a la API
│   ├── components/ # Componentes específicos
│   ├── pages/      # Páginas del módulo
│   └── types/      # Interfaces TypeScript
├── shared/         # Código compartido
│   ├── api/        # Configuración de axios e interceptores
│   ├── components/ # Componentes reutilizables (UI, Layout)
│   ├── hooks/      # Hooks personalizados
│   ├── lib/        # Utilidades
│   └── utils/      # Funciones auxiliares
└── router/         # Configuración de rutas
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Los tokens se almacenan en `localStorage` y se incluyen automáticamente en las peticiones mediante interceptores de Axios.

### Endpoints de Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/check-status` - Verificar estado de autenticación

## 📡 API Endpoints

### Niños
- `GET /api/ninos` - Obtener todos los niños
- `GET /api/ninos/:id` - Obtener un niño por ID
- `POST /api/ninos` - Crear un nuevo niño
- `PATCH /api/ninos/:id` - Actualizar un niño
- `DELETE /api/ninos/:id` - Eliminar un niño

### Asistencias
- `GET /api/asistencias` - Obtener todas las asistencias
- `GET /api/asistencias/:id` - Obtener una asistencia por ID
- `GET /api/asistencias/nino/:ninoId` - Obtener asistencias de un niño
- `GET /api/asistencias/fecha/:fecha` - Obtener asistencias por fecha
- `POST /api/asistencias` - Crear una nueva asistencia
- `PATCH /api/asistencias/:id` - Actualizar una asistencia
- `DELETE /api/asistencias/:id` - Eliminar una asistencia

## 🎨 Tecnologías Utilizadas

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **TanStack Query** - Gestión de estado del servidor
- **Zustand** - Gestión de estado global
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos
- **React Hook Form** - Manejo de formularios
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea una build de producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🔒 Rutas Protegidas

Las rutas bajo `/admin` requieren autenticación. Si un usuario no autenticado intenta acceder, será redirigido a la página de login.

## 📱 Responsive Design

La aplicación está completamente optimizada para dispositivos móviles, tablets y desktop.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y está destinado para uso interno.
