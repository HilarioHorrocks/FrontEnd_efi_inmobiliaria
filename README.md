# Frontend - Sistema Inmobiliario

Aplicación web para visualización y gestión de propiedades inmobiliarias, construida con React y Vite.

## 🚀 Tecnologías

- **React** 18
- **Vite** - Build tool
- **React Router DOM** - Navegación
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos
- **Context API** - Gestión de estado

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm 
- Backend corriendo en `http://localhost:5000`

## 🔧 Instalación

1. **Navegar al directorio frontend**
```bash
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx         # Dashboard de propiedades
│   │   ├── Navigation.jsx        # Barra de navegación
│   │   ├── NotificationSystem.jsx # Sistema de notificaciones
│   │   ├── PropertyDetailsModal.jsx # Modal de detalles
│   │   ├── PropertyFilters.jsx   # Filtros de búsqueda
│   │   └── ProtectedRoute.jsx    # HOC para rutas protegidas
│   ├── contexts/
│   │   ├── AuthContext.jsx       # Contexto de autenticación
│   │   ├── ClientsContext.jsx    # Contexto de clientes
│   │   ├── PropertiesContext.jsx # Contexto de propiedades
│   │   ├── RentalsContext.jsx    # Contexto de alquileres
│   │   └── SalesContext.jsx      # Contexto de ventas
│   ├── pages/
│   │   ├── AdminPage.jsx         # Panel de administración
│   │   ├── ClientsPage.jsx       # Gestión de clientes
│   │   ├── ForgotPasswordPage.jsx # Recuperar contraseña
│   │   ├── HomePage.jsx          # Página principal
│   │   ├── LoginPage.jsx         # Inicio de sesión
│   │   ├── MyRentalsPage.jsx     # Mis alquileres
│   │   ├── MySalesPage.jsx       # Mis compras
│   │   ├── ProfilePage.jsx       # Perfil de usuario
│   │   ├── PropertiesPage.jsx    # CRUD de propiedades
│   │   ├── RegisterPage.jsx      # Registro de usuario
│   │   └── ResetPasswordPage.jsx # Restablecer contraseña
│   ├── services/
│   │   ├── api.js                # Configuración de Axios
│   │   ├── auth.js               # Servicios de autenticación
│   │   ├── clients.js            # Servicios de clientes
│   │   ├── properties.js         # Servicios de propiedades
│   │   ├── rentals.js            # Servicios de alquileres
│   │   └── sales.js              # Servicios de ventas
│   ├── utils/
│   │   ├── pdfGenerator.js       # Generación de PDFs
│   │   └── propertyImages.js     # Gestión de imágenes
│   ├── App.jsx                   # Componente principal
│   ├── App.css                   # Estilos globales
│   ├── main.jsx                  # Punto de entrada
│   └── tailwind.css              # Configuración de Tailwind
│
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🔐 Autenticación

La aplicación utiliza JWT almacenado en `localStorage`:

- `token`: Token de autenticación
- `user`: Datos del usuario actual

### Flujo de autenticación:
1. Usuario hace login → recibe token
2. Token se guarda en localStorage
3. Token se envía en cada request mediante interceptor de Axios
4. Si token expira (401) → redirección automática a login

## 🎨 Páginas y Funcionalidades

### Públicas (Sin autenticación)
- **Home** (`/`) - Listado de propiedades destacadas
- **Login** (`/login`) - Inicio de sesión
- **Register** (`/register`) - Registro de nuevo usuario
- **Forgot Password** (`/forgot-password`) - Solicitar recuperación de contraseña
- **Reset Password** (`/reset-password`) - Restablecer contraseña con token

### Cliente (Rol: cliente)
- **Home** (`/`) - Todas las propiedades con filtros y favoritos
- **Mis Alquileres** (`/my-rentals`) - Propiedades alquiladas
- **Mis Compras** (`/my-sales`) - Propiedades compradas
- **Mi Perfil** (`/profile`) - Editar información personal

### Agente (Rol: agente)
- **Dashboard** (`/properties`) - Gestión de propiedades
- **Clientes** (`/clients`) - Gestión de clientes
- **Admin** (`/admin`) - Panel administrativo

### Admin (Rol: admin)
- Acceso a todas las funcionalidades del sistema

## 🏠 Funcionalidades de Propiedades

### Para Usuarios No Logueados
- Ver primeras 3 propiedades destacadas
- Ver detalles de propiedades
- Mensaje para crear cuenta

### Para Clientes Logueados
- Ver todas las propiedades disponibles
- Filtrar por tipo, precio, ubicación, etc.
- Agregar/quitar favoritos
- Alquilar propiedades con formulario detallado
- Comprar propiedades
- Ver historial de alquileres y compras
- Descargar contratos en PDF
- Cancelar alquileres/ventas

### Para Agentes/Admin
- Crear, editar, eliminar propiedades
- Gestionar clientes
- Ver estadísticas
- Acceso completo al sistema

## 🎯 Características Destacadas

### Sistema de Alquileres
- Formulario completo con:
  - Fechas de inicio y fin
  - Monto mensual, depósito y administración
  - Renovación automática
  - Servicios incluidos
  - Observaciones
- Validación de alquileres duplicados
- Estados: activo, finalizado, cancelado

### Sistema de Ventas
- Compra directa con un click
- Validación de compras duplicadas
- Estado: finalizada, cancelada
- Cambio automático de estado de propiedad

### Sistema de Favoritos
- Guardar propiedades favoritas por usuario
- Almacenamiento en localStorage
- Vista filtrada de favoritos

### Perfil de Usuario
- Edición de información personal
- Documento de identidad
- Fecha de nacimiento
- Teléfono y dirección
- Estado civil
- Profesión e ingresos mensuales

### Generación de PDFs
- Contratos de alquiler
- Recibos de venta
- Información completa de la transacción

## 🎨 Estilos y UX

- Diseño responsive
- Tailwind CSS para estilos
- Modales para detalles de propiedades
- Sistema de notificaciones
- Animaciones y transiciones
- Imágenes dinámicas con Unsplash

## 🔒 Seguridad

- Rutas protegidas por rol
- Redirección automática en sesión expirada
- Validación de permisos en frontend
- Interceptores de Axios para manejo de errores

## 📱 Responsive Design

La aplicación está optimizada para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🌐 Navegación

### Usuario No Logueado
```
Inmobiliaria | Login | Registrar
```

### Cliente
```
Inmobiliaria | Propiedades | Mis Alquileres | Mis Compras | [Nombre Usuario] | Logout
```

### Agente/Admin
```
Inmobiliaria | Dashboard | Clientes | Admin | [Nombre Usuario] | Logout
```

## 🎭 Contextos Disponibles

### AuthContext
- `user`: Usuario actual
- `login(email, password)`: Iniciar sesión
- `logout()`: Cerrar sesión
- `register(userData)`: Registrar usuario

### PropertiesContext
- `properties`: Lista de propiedades
- `fetchProperties(filters)`: Obtener propiedades
- `createProperty(data)`: Crear propiedad
- `updateProperty(id, data)`: Actualizar propiedad
- `deleteProperty(id)`: Eliminar propiedad

### RentalsContext
- `rentals`: Lista de alquileres
- `fetchRentalsByUser(userId)`: Obtener alquileres del usuario
- `createRental(data)`: Crear alquiler
- `cancelRental(id)`: Cancelar alquiler

### SalesContext
- `sales`: Lista de ventas
- `fetchSalesByUser(userId)`: Obtener compras del usuario
- `cancelSale(id)`: Cancelar venta

## 📝 Notas

- Los favoritos se guardan en localStorage por usuario
- Las imágenes son generadas dinámicamente con Unsplash
- El sistema previene alquileres/compras duplicadas
- Los PDFs se generan en el cliente

