# Documento Técnico

## Resumen
Sistema completo de gestión de productos con:
- **Backend**: REST API en Python (FastAPI) con SQLite
- **Frontends**: 3 aplicaciones cliente (React + 2 Angular)
- **Testing**: Suite automatizada con pytest y Vitest
- **CI/CD**: Azure DevOps Pipelines

## Arquitectura del Sistema

```
Backend_Python/
├── app.py                          # API FastAPI
├── requirements.txt                # Dependencias Python
├── pytest.ini                      # Configuración de testing
├── tests/                          # Tests del backend
│   ├── __init__.py
│   ├── conftest.py
│   └── test_api.py                # 11 tests de API
├── frontend/
│   ├── react-products-console/    # React + Vite (Puerto 5173)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── App.test.tsx
│   │   │   ├── api.ts
│   │   │   └── api.test.ts       # Tests Vitest
│   │   ├── vitest.config.ts
│   │   └── package.json
│   ├── angular-products-console/  # Angular Console (Puerto 4200)
│   │   ├── src/app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.component.spec.ts
│   │   │   ├── products-api.service.ts
│   │   │   └── products-api.service.spec.ts
│   │   └── package.json
│   └── angular-products-crud/     # Angular CRUD (Puerto 4300)
│       ├── src/app/
│       │   ├── app.component.ts
│       │   └── app.component.spec.ts
│       └── package.json

├── azure-pipelines.yml            # Pipeline principal
└── docs/                          # Documentación completa
```

## Esquema de la base de datos
Tabla `products`:
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `price` REAL NOT NULL
- `stock` INTEGER NOT NULL

Creación SQL utilizada:
```sql
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL
);
```

## Componentes y flujo
- `get_db()` abre conexión SQLite por request (dependencia de FastAPI) y usa `row_factory` para accesos por nombre.
- `init_db()` asegura la existencia de la tabla al iniciar la app (evento `startup`).
- Validación: Pydantic valida `name`, `price` (> 0) y `stock` (>= 0). Errores de validación devuelven `422 Unprocessable Entity`.
- Manejo de errores: `404` con `detail` cuando el recurso no existe; `500` genérico cuando hay fallo de DB.

## Configuración y ejecución local

### Backend (Puerto 8000)
1. Crear entorno virtual y activar (PowerShell):
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

2. Ejecutar la aplicación:
```powershell
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

3. Ejecutar tests:
```powershell
pytest -v
```

Por defecto corre en `http://127.0.0.1:8000`.

Documentación interactiva:
- Swagger UI: `http://127.0.0.1:8000/docs`
- OpenAPI JSON: `http://127.0.0.1:8000/openapi.json`

### Frontend React (Puerto 5173)
```powershell
cd frontend/react-products-console
npm install
npm run dev          # Desarrollo
npm test -- --run    # Tests
npm run build        # Producción
```

Configuración: `.env` con `VITE_API_BASE_URL=http://127.0.0.1:8000`

### Frontend Angular Console (Puerto 4200)
```powershell
cd frontend/angular-products-console
npm install
npm run start        # Desarrollo
npm run build        # Producción
```

Configuración: `src/environments/environment.ts`

### Frontend Angular CRUD (Puerto 4300)
```powershell
cd frontend/angular-products-crud
npm install
npm run start        # Desarrollo (puerto 4300)
npm run build        # Producción
```

Configuración: `src/environments/environment.ts`

## Despliegue y CI/CD

### Azure DevOps Pipelines
El proyecto incluye 3 pipelines configurados:

1. **azure-pipelines.yml** (Principal)
   - Build del backend y empaquetado
   - Build de React y Angular frontends
   - Publicación de artefactos
   - Deploy a Azure App Service (Linux)
   - Variables: `azureServiceConnection`, `webAppName`

### Configuración de Producción
- **Runtime**: Python 3.11 en Linux
- **Startup Command**: `gunicorn -k uvicorn.workers.UvicornWorker app:app --bind=0.0.0.0:8000`
- **Variables de entorno**:
  - `WEBSITES_PORT=8000`
  - `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
  - `ENABLE_ORYX_BUILD=true`
  - `CORS_ALLOW_ORIGINS` (opcional para producción)

## Testing
El proyecto incluye una suite completa de testing automatizado:

### Backend Testing (pytest)
- **Framework**: pytest 9.x con pytest-asyncio y httpx
- **Ubicación**: `tests/test_api.py`
- **Cobertura**: 11 tests
  - CRUD operations completas
  - Validación de datos (campos obligatorios, tipos, rangos)
  - Manejo de errores (404, 422, 500)
  - Verificación de CORS
  - Tests de integración
- **Ejecución**:
  ```bash
  pytest -v                    # Tests con detalle
  pytest --cov=. --cov-report=html  # Con coverage
  ```

### Frontend React Testing (Vitest)
- **Framework**: Vitest 1.6 + Testing Library
- **Ubicación**: `frontend/react-products-console/src/`
- **Cobertura**: 8 tests
  - Renderizado de componentes
  - Interacción de usuario
  - Mocks de API con fetch
  - Tests de servicios
- **Ejecución**:
  ```bash
  npm test              # Watch mode
  npm test -- --run     # Run once
  npm run test:coverage # Con coverage
  ```

### Frontend Angular Testing
- **Framework**: Jasmine + Karma
- **Test files**: 
  - `app.component.spec.ts` (ambos frontends)
  - `products-api.service.spec.ts` (Console)
- **Características**:
  - Tests de componentes con ComponentFixture
  - Mocking de HttpClient con HttpClientTestingModule
  - Tests de ciclo de vida
- **Ejecución**: `ng test` (requiere ChromeHeadless configurado)

Ver documentación completa en `docs/Testing.md`

## Tecnologías Utilizadas

### Backend
- **Python 3.11+**
- **FastAPI 0.115+** - Framework web moderno y rápido
- **Uvicorn** - Servidor ASGI
- **Gunicorn** - Production server con workers Uvicorn
- **SQLite** - Base de datos (local/desarrollo)
- **Pydantic** - Validación de datos

### Frontend React
- **React 18.3** - Library UI
- **Vite 5.4** - Build tool y dev server
- **TypeScript 5.6** - Tipado estático
- **Vitest 1.6** - Testing framework
- **Testing Library** - Tests de componentes

### Frontend Angular
- **Angular 17.3** - Framework completo
- **Standalone Components** - Arquitectura moderna
- **RxJS** - Programación reactiva
- **TypeScript 5.4**
- **Jasmine + Karma** - Testing

### DevOps y Herramientas
- **Azure DevOps** - CI/CD Pipelines
- **Azure App Service** - Hosting (Linux)
- **pytest** - Testing Python
- **Node.js 18.x** - Runtime para frontends
- **npm** - Gestión de paquetes JavaScript

## CORS y Seguridad

### Configuración CORS
El backend permite peticiones desde:
- `http://localhost:4200` - Angular Console
- `http://127.0.0.1:4200`
- `http://localhost:4300` - Angular CRUD
- `http://127.0.0.1:4300`
- `http://localhost:5173` - React Console
- `http://127.0.0.1:5173`

Variable de entorno: `CORS_ALLOW_ORIGINS` (separado por comas)

### Recomendaciones de Seguridad
- Habilitar HTTPS/TLS en producción
- Implementar autenticación (JWT/OAuth2)
- Validar y sanear todas las entradas
- Rate limiting en API
- Migrar a base de datos gestionada (PostgreSQL/MySQL)
- Configurar CORS restrictivo en producción
- Logs y monitoreo con Application Insights
