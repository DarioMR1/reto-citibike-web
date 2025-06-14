# CitiBike Analytics Frontend

Interface web moderna desarrollada con Next.js para la plataforma de análisis y machine learning de CitiBike. Este frontend se conecta con el backend FastAPI para proporcionar visualizaciones interactivas, dashboards y funcionalidades de predicción.

## Desarrollador

**Darío Mariscal Rocha** - Equipo 5

## Arquitectura

Este proyecto implementa la interfaz de usuario para el sistema de análisis de CitiBike con las siguientes tecnologías:

- **Framework**: Next.js 15 con React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Componentes UI**: Radix UI primitives
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **Tablas**: TanStack React Table
- **Gestión de paquetes**: pnpm

## Estructura del Proyecto

```
reto-citibike-web/
├── app/
│   ├── page.tsx              # Página principal del dashboard
│   ├── layout.tsx            # Layout principal de la aplicación
│   ├── globals.css           # Estilos globales
│   └── favicon.ico           # Icono de la aplicación
├── components/
│   ├── dashboard/            # Componentes específicos del dashboard
│   ├── charts/               # Componentes de gráficos y visualizaciones
│   └── ui/                   # Componentes UI reutilizables (Radix UI)
├── services/
│   └── api.ts                # Servicios para comunicación con el backend
├── types/
│   └── index.ts              # Definiciones de tipos TypeScript
├── lib/
│   └── utils.ts              # Funciones utilitarias
├── public/                   # Archivos estáticos
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
├── next.config.ts            # Configuración de Next.js
├── postcss.config.mjs        # Configuración de PostCSS
├── eslint.config.mjs         # Configuración de ESLint
└── env.example               # Plantilla de variables de entorno
```

## Conexión con el Backend

El frontend se comunica con el backend FastAPI (`reto-citibike`) a través de:

### Configuración de API

- **Archivo**: `services/api.ts`
- **URL Base**: Configurada a través de `NEXT_PUBLIC_API_URL`
- **Métodos**: GET, POST para interactuar con todos los endpoints del backend

### Endpoints Utilizados

- `GET /api/status` - Estado del sistema
- `GET /api/dashboard` - Datos del dashboard y KPIs
- `POST /api/train/supervised` - Entrenamiento de modelos supervisados
- `POST /api/train/unsupervised` - Entrenamiento de modelos no supervisados
- `POST /api/predict/single` - Predicciones individuales
- `POST /api/predict/anomaly` - Detección de anomalías
- `POST /api/analyze/batch` - Análisis por lotes
- `GET /api/anomalies/analysis` - Análisis de anomalías
- `GET /api/counterfactual/analysis` - Análisis contrafactual

### Tipos de Datos

- **Archivo**: `types/index.ts`
- **Definiciones**: Interfaces TypeScript que coinciden con los modelos Pydantic del backend
- **Cobertura**: Todos los tipos de datos intercambiados entre frontend y backend

## Funcionalidades

### Dashboard Principal

- **KPIs en tiempo real**: Métricas clave del sistema CitiBike
- **Visualizaciones interactivas**: Gráficos de barras, líneas y scatter plots
- **Tablas de datos**: Información detallada con filtrado y ordenamiento
- **Responsivo**: Adaptable a diferentes tamaños de pantalla

### Predicciones

- **Predicciones individuales**: Formularios para estimar ingresos por viaje
- **Análisis por lotes**: Evaluación de múltiples escenarios
- **Detección de anomalías**: Identificación de patrones inusuales
- **Análisis contrafactual**: Estimación de pérdidas por escasez

### Machine Learning

- **Entrenamiento de modelos**: Interfaz para entrenar modelos supervisados y no supervisados
- **Métricas de rendimiento**: Visualización de R², RMSE, MAE
- **Comparación de algoritmos**: Random Forest vs Gradient Boosting
- **Gestión de modelos**: Estado de entrenamiento y resultados

## Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- pnpm (recomendado) o npm
- Backend CitiBike corriendo (`reto-citibike`)

### Configuración del Entorno

1. **Clonar variables de entorno**:

```bash
cp env.example .env.local
```

2. **Configurar API URL**:

```bash
# Para desarrollo local
NEXT_PUBLIC_API_URL=http://localhost:8000

# Para producción
NEXT_PUBLIC_API_URL=https://your-cloud-run-url.run.app
```

### Instalación de Dependencias

```bash
pnpm install
```

### Ejecución en Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para Producción

```bash
pnpm build
pnpm start
```

## Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm start` - Inicia la aplicación en modo producción
- `pnpm lint` - Ejecuta el linter ESLint

## Dependencias Principales

### Producción

- **next**: 15.3.3 - Framework React
- **react**: 19.0.0 - Librería de UI
- **@radix-ui/\***: Componentes UI primitivos
- **recharts**: 2.15.3 - Gráficos interactivos
- **@tanstack/react-table**: 8.21.3 - Tablas avanzadas
- **tailwind-merge**: 3.3.1 - Utilitarios de Tailwind
- **lucide-react**: 0.514.0 - Iconos
- **date-fns**: 4.1.0 - Manipulación de fechas

### Desarrollo

- **typescript**: 5 - Tipado estático
- **tailwindcss**: 4 - Framework CSS
- **eslint**: 9 - Linter de código

## Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio** con Vercel
2. **Configurar variables de entorno**:
   - `NEXT_PUBLIC_API_URL`: URL del backend en Cloud Run
3. **Deploy automático** en cada push a main

### Otras Plataformas

La aplicación es compatible con cualquier plataforma que soporte Next.js:

- Netlify
- AWS Amplify
- Google Cloud Run
- Docker

## Desarrollo

### Estructura de Componentes

- **Componentes UI**: Reutilizables, basados en Radix UI
- **Componentes de Dashboard**: Específicos para visualizaciones
- **Componentes de Gráficos**: Wrappers de Recharts
- **Hooks personalizados**: Para manejo de estado y API

### Estándares de Código

- **TypeScript**: Tipado estricto
- **ESLint**: Configuración de Next.js
- **Tailwind CSS**: Utility-first CSS
- **Componentes funcionales**: Con hooks de React

### Testing

El proyecto está configurado para testing con Jest y React Testing Library (configuración disponible para extensión).

## Integración con Backend

### Flujo de Datos

1. **Frontend** envía peticiones HTTP al backend FastAPI
2. **Backend** procesa datos con Snowflake y modelos ML
3. **Backend** retorna JSON estructurado
4. **Frontend** renderiza datos en componentes React

### Manejo de Errores

- Validación de respuestas API
- Estados de carga y error
- Fallbacks para datos no disponibles
- Notificaciones de usuario con toast

### Sincronización

- Estado reactivo con React hooks
- Refetch automático de datos
- Optimistic updates donde apropiado

## Contribución

1. Fork del repositorio
2. Crear rama de feature
3. Desarrollar cambios
4. Ejecutar linting y tests
5. Crear pull request

## Licencia

MIT License
