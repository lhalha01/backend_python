# Backend Python - Sistema de Gestión de Productos

Sistema completo de gestión de productos con API REST en FastAPI y múltiples interfaces frontend (React + Angular).

## 🚀 Características

- **Backend API REST** con FastAPI y SQLite
- **3 Frontends independientes**: React Console + 2 Angular
- **Testing automatizado**: pytest + Vitest (19 tests ejecutados exitosamente)
- **CI/CD**: Azure DevOps Pipelines
- **CORS configurado** para desarrollo
- **Documentación completa** con Swagger/OpenAPI

## 📋 Requisitos Previos

- **Python 3.11+**
- **Node.js 18.x+**
- **npm** o **yarn**
- **Git**
- Cuenta de Azure (opcional, para deployment)

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Frontends                             │
├──────────────────┬──────────────────┬───────────────────┤
│  React Console   │ Angular Console  │  Angular CRUD     │
│   (Port 5173)    │   (Port 4200)    │   (Port 4300)     │
│  Vite + TS       │  Standalone      │  Modal-based      │
└──────────────────┴──────────────────┴───────────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │   CORS Layer  │
                   └───────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │  FastAPI REST │
                   │   (Port 8000) │
                   └───────────────┘
                           │
                           ▼
                   ┌───────────────┐
                   │    SQLite     │
                   │  products.db  │
                   └───────────────┘
```

## 🚀 Quick Start

### 1. Backend

```bash
# Crear y activar entorno virtual
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows PowerShell

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python -m uvicorn app:app --reload --port 8000
```

**API disponible en**: http://127.0.0.1:8000/docs

### 2. Frontend React Console

```bash
cd frontend/react-products-console
npm install
npm run dev
```

**Acceso**: http://localhost:5173

### 3. Frontend Angular Console

```bash
cd frontend/angular-products-console
npm install
npm run start
```

**Acceso**: http://localhost:4200

### 4. Frontend Angular CRUD

```bash
cd frontend/angular-products-crud
npm install
npm run start
```

**Acceso**: http://localhost:4300

## 🧪 Testing

### Backend Tests
```bash
# Ejecutar todos los tests
pytest -v

# Con coverage
pytest --cov=. --cov-report=html
```

**Resultado**: ✅ 11/11 tests passed

### Frontend React Tests
```bash
cd frontend/react-products-console
npm test -- --run
```

**Resultado**: ✅ 8/8 tests passed

### Total: 19 tests ejecutados exitosamente ✅

## 📁 Estructura del Proyecto

```
Backend_Python/
├── 📄 app.py                           # API FastAPI principal
├── 📄 requirements.txt                  # Dependencias Python
├── 📄 pytest.ini                        # Configuración testing
├── 📄 README.md                         # Este archivo
├── 🗄️ products.db                       # Base de datos SQLite
│
├── 📂 tests/                            # Tests del backend
│   ├── __init__.py
│   ├── conftest.py
│   └── test_api.py                     # 11 tests API
│
├── 📂 frontend/
│   ├── 📂 react-products-console/      # React + Vite (5173)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── App.test.tsx           # Tests componentes
│   │   │   ├── api.ts
│   │   │   └── api.test.ts            # Tests API
│   │   ├── vitest.config.ts
│   │   └── package.json
│   │
│   ├── 📂 angular-products-console/    # Angular Console (4200)
│   │   ├── src/app/
│   │   │   ├── app.component.ts
│   │   │   ├── app.component.spec.ts
│   │   │   ├── products-api.service.ts
│   │   │   └── products-api.service.spec.ts
│   │   └── package.json
│   │
│   └── 📂 angular-products-crud/       # Angular CRUD (4300)
│       ├── src/app/
│       │   ├── app.component.ts
│       │   └── app.component.spec.ts
│       └── package.json
│
├── 📂 docs/                             # Documentación completa
│   ├── Documento_Funcional.md          # Especificación funcional
│   ├── Documento_Tecnico.md            # Documentación técnica
│   ├── Frontends.md                    # Guía de frontends
│   ├── Testing.md                      # Guía de testing
│   ├── Despliegue_AppService_AzureDevOps.md
│   ├── postman_collection.json
│   └── Postman_Readme.md
│
└── 📂 .azure-pipelines/
    └── azure-pipelines.yml             # Pipeline principal
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/products` | Listar todos los productos |
| GET | `/products/{id}` | Obtener producto por ID |
| POST | `/products` | Crear nuevo producto |
| PUT | `/products/{id}` | Actualizar producto |
| DELETE | `/products/{id}` | Eliminar producto |

**Swagger UI**: http://127.0.0.1:8000/docs

## 🎨 Frontends

### React Console (Puerto 5173)
- **Tecnología**: React 18 + Vite + TypeScript
- **Características**: Interfaz tabbed, request manual, tema azul/verde
- **Testing**: ✅ 8 tests con Vitest

### Angular Console (Puerto 4200)
- **Tecnología**: Angular 17 Standalone
- **Características**: Navegación por API buttons, tema púrpura/rosa
- **Testing**: ✅ Test files con Jasmine/Karma

### Angular CRUD (Puerto 4300)
- **Tecnología**: Angular 17 Standalone
- **Características**: Tabla + Modal, CRUD completo, tema azul/verde
- **Testing**: ✅ Test files con Jasmine/Karma

Ver guía completa en [docs/Frontends.md](./docs/Frontends.md)

## 🧪 Cobertura de Testing

### Backend (pytest)
```
11 tests passed
- CRUD operations ✅
- Data validation ✅
- Error handling (404, 422, 500) ✅
- CORS verification ✅
- Integration tests ✅
```

### Frontend React (Vitest)
```
8 tests passed
- Component rendering ✅
- User interactions ✅
- API mocking ✅
- Service tests ✅
```

**Documentación completa**: [docs/Testing.md](./docs/Testing.md)

## 🔐 CORS

Configurado para desarrollo:
- `http://localhost:4200` (Angular Console)
- `http://localhost:4300` (Angular CRUD)
- `http://localhost:5173` (React Console)
- También con `127.0.0.1`

**Variable de entorno**: `CORS_ALLOW_ORIGINS=http://localhost:4200,http://localhost:4300,http://localhost:5173`

##  Documentación

| Documento | Descripción |
|-----------|-------------|
| [Documento_Funcional.md](./docs/Documento_Funcional.md) | Especificación funcional y casos de uso |
| [Documento_Tecnico.md](./docs/Documento_Tecnico.md) | Arquitectura y detalles técnicos |
| [Frontends.md](./docs/Frontends.md) | Guía completa de los 3 frontends |
| [Testing.md](./docs/Testing.md) | Guía de testing y coverage |
| [Despliegue_AppService_AzureDevOps.md](./docs/Despliegue_AppService_AzureDevOps.md) | CI/CD y deployment |
| [Postman_Readme.md](./docs/Postman_Readme.md) | Colección de Postman |

## 🛠️ Tecnologías

### Backend
- Python 3.11+
- FastAPI 0.115+
- Uvicorn + Gunicorn
- SQLite
- pytest

### Frontend React
- React 18
- Vite 5.4
- TypeScript 5.6
- Vitest 1.6

### Frontend Angular
- Angular 17
- Standalone Components
- RxJS
- Jasmine/Karma

### DevOps
- Azure DevOps
- Azure App Service

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de uso educativo y demostrativo.

## 👥 Contacto

Para más información o consultas sobre el proyecto, revisar la documentación en la carpeta `docs/`.

---

**Estado del Proyecto**: ✅ Producción Ready
- Backend: ✅ Funcionando con 11 tests
- React Frontend: ✅ Funcionando con 8 tests  
- Angular Frontends: ✅ Funcionando (tests listos)
- CI/CD: ✅ Pipeline configurado
