# CitiBike Analytics Platform

Una plataforma moderna de análisis y machine learning para operaciones de CitiBike, con un backend FastAPI desplegado en Google Cloud Run y un frontend Next.js desplegado en Vercel.

## Arquitectura

- **Backend**: FastAPI + Python (ML Models, Snowflake DB) → Cloud Run
- **Frontend**: Next.js + TypeScript + Tailwind CSS → Vercel
- **Base de Datos**: Snowflake
- **ML Models**: Scikit-learn (Supervisado y No supervisado)

## 📁 Estructura del Proyecto

```
├── reto-citibike/                # Backend FastAPI
│   ├── main.py                   # Servidor FastAPI principal
│   ├── database.py               # Conexiones a Snowflake
│   ├── models.py                 # Modelos ML
│   ├── visualizations.py         # Generación de gráficos
│   ├── simulations.py            # Simulaciones y predicciones
│   ├── requirements.txt          # Dependencias Python
│   ├── Dockerfile               # Configuración Docker
│   ├── Makefile                 # Comandos de despliegue
│   └── .env                     # Variables de entorno
├── reto-citibike-web/           # Frontend Next.js
│   ├── app/
│   │   └── page.tsx             # Página principal del dashboard
│   ├── components/ui/           # Componentes UI
│   ├── lib/
│   │   └── utils.ts             # Utilidades
│   └── env.example              # Variables de entorno ejemplo
└── README.md                    # Este archivo
```

## 🚀 Despliegue del Backend (FastAPI en Cloud Run)

### 1. Configurar Variables de Entorno

En el directorio `reto-citibike/`, crea un archivo `.env` basado en `env.example`:

```bash
cd reto-citibike
cp env.example .env
```

Edita el archivo `.env` con tus valores:

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
SERVICE_NAME=citibike-analytics-api

# Snowflake Database Configuration
SNOWFLAKE_ACCOUNT=your_account_here
SNOWFLAKE_USER=your_user_here
SNOWFLAKE_PASSWORD=your_password_here
SNOWFLAKE_DATABASE=your_database_here
SNOWFLAKE_SCHEMA=your_schema_here

# Application Configuration
APP_ENV=production
DEBUG=False
PORT=8000
```

### 2. Configurar Google Cloud

```bash
# Autenticarse en Google Cloud
gcloud auth login
gcloud auth application-default login

# Configurar el proyecto
gcloud config set project YOUR_PROJECT_ID

# Habilitar APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Desplegar usando Makefile

```bash
cd reto-citibike

# Desplegar el servicio
make deploy

# Otros comandos disponibles:
make status    # Ver estado del servicio
make logs      # Ver logs del servicio
make delete    # Eliminar el servicio
```

### 4. Obtener la URL del servicio

```bash
# Ver información del servicio desplegado
make status

# O directamente obtener la URL
gcloud run services describe citibike-analytics-api \
  --region us-central1 \
  --format 'value(status.url)'
```

## 🌐 Despliegue del Frontend (Next.js en Vercel)

### 1. Preparar el proyecto

```bash
cd reto-citibike-web

# Instalar dependencias
pnpm install

# Crear archivo de variables de entorno
cp env.example .env.local
```

### 2. Configurar Variables de Entorno

En `.env.local`:

```env
# Reemplaza con tu URL de Cloud Run
NEXT_PUBLIC_API_URL=https://citibike-analytics-api-xxxxxxxxx-uc.a.run.app
```

### 3. Desplegar en Vercel

#### Opción A: Usando Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en producción
vercel env add NEXT_PUBLIC_API_URL
```

#### Opción B: Usando GitHub + Vercel Dashboard

1. Sube el código a GitHub
2. Conecta tu repositorio en [vercel.com](https://vercel.com)
3. Configura la variable de entorno `NEXT_PUBLIC_API_URL` en el dashboard
4. Despliega automáticamente

### 4. Probar la aplicación

Tu aplicación estará disponible en:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-service-url.run.app`

## 🧪 Desarrollo Local

### Backend Local

```bash
cd reto-citibike

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor (asegúrate de tener el archivo .env configurado)
uvicorn main:app --reload --port 8000
```

### Frontend Local

```bash
cd reto-citibike-web

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000` y se conectará al backend en `http://localhost:8000`.

## 🛠️ Comandos de Makefile

El proyecto incluye un `Makefile` con comandos útiles para la gestión del servicio:

```bash
make deploy    # Despliega el servicio en Cloud Run
make delete    # Elimina el servicio de Cloud Run
make status    # Muestra el estado del servicio
make logs      # Muestra los logs del servicio
```

## 📊 Funcionalidades

### Dashboard Principal

- KPIs de ingresos y viajes
- Visualizaciones interactivas
- Estado del sistema en tiempo real

### Entrenamiento de Modelos

- **Modelo Supervisado**: Predice ingresos por minutos excedentes
- **Modelo No Supervisado**: Detecta anomalías en patrones de uso

### Simulaciones y Predicciones

- Predicciones individuales de ingresos
- Análisis de escenarios por lotes
- Detección de anomalías en tiempo real
- Análisis contrafactual de pérdidas

### Análisis de Anomalías

- Detección de patrones inusuales
- Análisis temporal y por estación
- Métricas de rendimiento

## 🔧 API Endpoints

### Estado del Sistema

- `GET /api/status` - Estado de los modelos
- `POST /api/models/load` - Cargar modelos guardados
- `POST /api/models/save` - Guardar modelos actuales

### Dashboard

- `GET /api/dashboard` - Datos del dashboard y KPIs
- `GET /api/visualizations/{chart_type}` - Gráficos específicos

### Entrenamiento

- `POST /api/train/supervised` - Entrenar modelo supervisado
- `POST /api/train/unsupervised` - Entrenar detección de anomalías

### Predicciones

- `POST /api/predict/single` - Predicción individual
- `POST /api/predict/anomaly` - Detectar anomalía
- `POST /api/analyze/batch` - Análisis por lotes

### Análisis

- `GET /api/anomalies/analysis` - Análisis de anomalías
- `GET /api/counterfactual/analysis` - Análisis contrafactual

## 🛠️ Tecnologías Utilizadas

### Backend

- **FastAPI**: Framework web moderno para Python
- **Pandas/NumPy**: Procesamiento de datos
- **Scikit-learn**: Machine learning
- **Plotly**: Visualizaciones
- **Snowflake**: Base de datos
- **Pydantic**: Validación de datos

### Frontend

- **Next.js 14**: Framework React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **Radix UI**: Componentes accesibles
- **Lucide React**: Iconos

### Despliegue

- **Google Cloud Run**: Backend containerizado
- **Vercel**: Frontend estático
- **Docker**: Containerización
- **Make**: Automatización de despliegue

## 🔒 Seguridad

- Variables de entorno para credenciales sensibles
- CORS configurado correctamente
- Validación de entrada con Pydantic
- Usuario no-root en el contenedor Docker
- Timeouts y límites de recursos en Cloud Run

## 📈 Monitoreo

- Logs centralizados en Google Cloud Logging
- Métricas de rendimiento en Cloud Run
- Análisis de uso en Vercel Analytics

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

Para soporte técnico o preguntas, crea un issue en el repositorio de GitHub.
