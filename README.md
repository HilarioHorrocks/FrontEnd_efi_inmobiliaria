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
│   ├── components/              # Componentes compartidos
│   │   ├── Dashboard.jsx        # Dashboard de propiedades
│   │   ├── Navigation.jsx       # Barra de navegación
│   │   ├── NotificationSystem.jsx # Sistema de notificaciones
│   │   └── ProtectedRoute.jsx   # HOC para rutas protegidas
│   ├── contexts/                # Gestión de estado global
│   │   ├── AuthContext.jsx      # Contexto de autenticación
│   │   ├── ClientsContext.jsx   # Contexto de clientes
│   │   ├── PropertiesContext.jsx # Contexto de propiedades
│   │   ├── RentalsContext.jsx   # Contexto de alquileres
│   │   └── SalesContext.jsx     # Contexto de ventas
│   ├── modules/                
│   │   ├── auth/                # Módulo de autenticación
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── AuthPages.css
│   │   │   └── index.js
│   │   ├── properties/          # Módulo de propiedades
│   │   │   ├── PropertiesPage.jsx
│   │   │   ├── PropertiesPage.css
│   │   │   ├── PropertyDetailsModal.jsx
│   │   │   ├── PropertyDetailsModal.css
│   │   │   ├── PropertyFilters.jsx
│   │   │   ├── PropertyFilters.css
│   │   │   └── index.js
│   │   ├── rentals/             # Módulo de alquileres
│   │   │   ├── MyRentalsPage.jsx
│   │   │   ├── MyRentalsPage.css
│   │   │   └── index.js
│   │   ├── sales/               # Módulo de ventas
│   │   │   ├── MySalesPage.jsx
│   │   │   ├── MySalesPage.css
│   │   │   └── index.js
│   │   ├── clients/             # Módulo de clientes
│   │   │   ├── ClientsPage.jsx
│   │   │   ├── ClientsPage.css
│   │   │   └── index.js
│   │   ├── profile/             # Módulo de perfil
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── ProfilePage.css
│   │   │   └── index.js
│   │   ├── admin/               # Módulo de administración
│   │   │   ├── AdminPage.jsx
│   │   │   ├── AdminPage.css
│   │   │   └── index.js
│   │   └── home/                # Módulo de inicio
│   │       ├── HomePage.jsx
│   │       ├── HomePage.css
│   │       └── index.js
│   ├── services/                # Servicios API
│   │   ├── api.js               # Configuración de Axios
│   │   ├── auth.js              # Servicios de autenticación
│   │   ├── clients.js           # Servicios de clientes
│   │   ├── properties.js        # Servicios de propiedades
│   │   ├── rentals.js           # Servicios de alquileres
│   │   └── sales.js             # Servicios de ventas
│   ├── utils/                   # Utilidades
│   │   ├── pdfGenerator.js      # Generación de PDFs
│   │   └── propertyImages.js    # Gestión de imágenes
│   ├── App.jsx                  # Componente principal
│   ├── App.css                  # Estilos globales
│   ├── main.jsx                 # Punto de entrada
│   └── tailwind.css             # Configuración de Tailwind
│
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

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

