# Testing Documentation

Este proyecto incluye tests automatizados para todos los componentes.

## Backend (Python + FastAPI)

### Ejecutar tests
```bash
# Instalar dependencias de testing
pip install -r requirements.txt

# Ejecutar todos los tests
pytest

# Ejecutar con cobertura
pytest --cov=. --cov-report=html

# Ejecutar tests específicos
pytest tests/test_api.py -v
```

### Estructura de tests
- `tests/test_api.py` - Tests de la API REST
- Tests incluyen:
  - CRUD completo de productos
  - Validación de datos
  - Manejo de errores
  - Headers CORS

## Frontend React

### Ejecutar tests
```bash
cd frontend/react-products-console

# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Ejecutar tests con UI
npm run test:ui

# Cobertura de código
npm run test:coverage
```

### Tests incluidos
- `App.test.tsx` - Tests del componente principal
- `api.test.ts` - Tests de servicios API
- Tests de renderizado y funcionalidad

## Frontend Angular Console

### Ejecutar tests
```bash
cd frontend/angular-products-console

# Ejecutar tests
npm test

# Tests con cobertura
npm test -- --code-coverage

# Tests en modo watch
npm test -- --watch
```

### Tests incluidos
- `app.component.spec.ts` - Tests del componente principal
- `products-api.service.spec.ts` - Tests del servicio API
- Tests de navegación y operaciones CRUD

## Frontend Angular CRUD

### Ejecutar tests
```bash
cd frontend/angular-products-crud

# Ejecutar tests
npm test

# Tests con cobertura
npm test -- --code-coverage
```

### Tests incluidos
- `app.component.spec.ts` - Tests del componente CRUD
- Tests de modales y formularios
- Tests de operaciones de tabla

## CI/CD - Azure Pipelines

Los tests se ejecutan automáticamente en los pipelines:

1. **Backend**: 
   - Instala dependencias
   - Ejecuta pytest
   - Genera reporte de cobertura

2. **Frontends**:
   - Instala node_modules
   - Ejecuta tests de cada frontend
   - Valida builds

## Cobertura de Código

### Objetivo
- Backend: >80% cobertura
- Frontends: >70% cobertura

### Ver reportes
- Backend: `htmlcov/index.html`
- React: `frontend/react-products-console/coverage/index.html`
- Angular: `frontend/angular-*/coverage/index.html`
