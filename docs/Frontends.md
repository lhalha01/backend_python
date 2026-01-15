# Frontends - Guía Completa

Este proyecto incluye **tres frontends independientes** para consumir la API FastAPI de productos, cada uno con características y propósitos específicos.

## Backend (FastAPI)

### Arranque
```bash
# Con entorno virtual activado
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

### Endpoints disponibles
- Swagger UI: `http://127.0.0.1:8000/docs`
- OpenAPI JSON: `http://127.0.0.1:8000/openapi.json`
- Base URL API: `http://127.0.0.1:8000`

### CORS Configurado
El backend permite peticiones desde:
- `http://localhost:4200` y `http://127.0.0.1:4200` (Angular Console)
- `http://localhost:4300` y `http://127.0.0.1:4300` (Angular CRUD)
- `http://localhost:5173` y `http://127.0.0.1:5173` (React Console)

**Variable de entorno**: `CORS_ALLOW_ORIGINS=http://localhost:4200,http://localhost:4300,http://localhost:5173`

---

## 1. React Console (Vite)

### Características
- **Puerto**: 5173
- **Tecnología**: React 18 + Vite + TypeScript
- **Tema**: Azul/verde con degradados
- **Interfaz**: Tabbed (Productos / Request manual)
- **Testing**: ✅ Vitest + Testing Library (8 tests)

### Funcionalidades
- ✅ Listado de productos con tabla interactiva
- ✅ Crear productos con formulario validado
- ✅ Actualizar precio de productos
- ✅ Eliminar productos con confirmación
- ✅ Manejo de errores en tiempo real
- ✅ Request manual personalizada (método, endpoint, body)
- ✅ Configuración dinámica de API base URL

### Instalación y Ejecución
```bash
cd frontend/react-products-console
npm install

# Desarrollo
npm run dev              # http://localhost:5173

# Testing
npm test                 # Watch mode
npm test -- --run        # Run once
npm run test:coverage    # Con coverage

# Producción
npm run build
npm run preview          # Preview build
```

### Configuración
Crear `.env` (opcional):
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Por defecto usa `http://127.0.0.1:8000`.

### Estructura del Proyecto
```
react-products-console/
├── src/
│   ├── App.tsx              # Componente principal
│   ├── App.test.tsx         # Tests de componentes
│   ├── api.ts               # Cliente API
│   ├── api.test.ts          # Tests de API
│   ├── types.ts             # TypeScript types
│   ├── setupTests.ts        # Configuración tests
│   └── main.tsx
├── vitest.config.ts         # Configuración Vitest
├── package.json
└── vite.config.ts
```

---

## 2. Angular Console (Standalone)

### Características
- **Puerto**: 4200
- **Tecnología**: Angular 17 (Standalone Components)
- **Tema**: Púrpura/rosa con gradientes
- **Interfaz**: Navegación por botones de API
- **Testing**: ✅ Jasmine/Karma (test files listos)

### Funcionalidades
- ✅ Navegación visual por operaciones API (GET, POST, PUT, DELETE)
- ✅ Testing individual de cada endpoint
- ✅ GET /products - Listar con tabla
- ✅ POST /products - Crear con formulario
- ✅ GET /products/{id} - Obtener por ID
- ✅ PUT /products/{id} - Actualizar precio
- ✅ DELETE /products/{id} - Eliminar producto
- ✅ Manejo de estados (busy, error)
- ✅ Feedback visual con alertas

### Instalación y Ejecución
```bash
cd frontend/angular-products-console
npm install

# Desarrollo
npm run start            # http://localhost:4200

# Testing (requiere Chrome/ChromeHeadless)
ng test

# Producción
npm run build            # Output: dist/angular-products-console
```

### Configuración
Editar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://127.0.0.1:8000'
};
```

### Estructura del Proyecto
```
angular-products-console/
├── src/
│   ├── app/
│   │   ├── app.component.ts           # Componente principal
│   │   ├── app.component.spec.ts      # Tests
│   │   ├── products-api.service.ts    # Servicio API
│   │   ├── products-api.service.spec.ts # Tests servicio
│   │   └── types.ts
│   ├── environments/
│   │   └── environment.ts
│   └── styles.css
├── angular.json
└── package.json
```

---

## 3. Angular CRUD (Standalone)

### Características
- **Puerto**: 4300
- **Tecnología**: Angular 17 (Standalone Components)
- **Tema**: Azul/verde corporativo
- **Interfaz**: Tabla + Modal para CRUD
- **Testing**: ✅ Jasmine/Karma (test files listos)

### Funcionalidades
- ✅ Tabla de productos con datos completos
- ✅ Modal para crear nuevos productos
- ✅ Modal para editar productos existentes
- ✅ Eliminar con confirmación (botón en tabla)
- ✅ Validación de formularios
- ✅ Actualización automática después de operaciones
- ✅ Manejo de errores con mensajes claros
- ✅ Responsive design

### Instalación y Ejecución
```bash
cd frontend/angular-products-crud
npm install

# Desarrollo
npm run start            # http://localhost:4300

# Testing
ng test

# Producción
npm run build            # Output: dist/angular-products-crud
```

### Configuración
Editar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://127.0.0.1:8000'
};
```

### Estructura del Proyecto
```
angular-products-crud/
├── src/
│   ├── app/
│   │   ├── app.component.ts      # Componente principal con modal
│   │   ├── app.component.spec.ts # Tests
│   │   ├── products.service.ts   # Servicio API
│   │   └── types.ts
│   ├── environments/
│   │   └── environment.ts
│   └── styles.css
├── angular.json
└── package.json
```

---

## Comparación de Frontends

| Característica | React Console | Angular Console | Angular CRUD |
|---------------|--------------|----------------|--------------|
| **Puerto** | 5173 | 4200 | 4300 |
| **Framework** | React 18 + Vite | Angular 17 | Angular 17 |
| **Interfaz** | Tabs | API Buttons | Table + Modal |
| **Tema** | Azul/Verde | Púrpura/Rosa | Azul/Verde |
| **Tests ejecutables** | ✅ Sí (Vitest) | ⚠️ Requiere setup | ⚠️ Requiere setup |
| **Propósito** | Console completa | Test endpoints | CRUD tradicional |
| **Request manual** | ✅ Sí | ❌ No | ❌ No |
| **Modal UI** | ❌ No | ❌ No | ✅ Sí |
| **TypeScript** | ✅ Sí | ✅ Sí | ✅ Sí |

---

## Ejecutar Todo el Sistema

### Opción 1: Terminales separadas
```bash
# Terminal 1 - Backend
python -m uvicorn app:app --reload --port 8000

# Terminal 2 - React Console
cd frontend/react-products-console && npm run dev

# Terminal 3 - Angular Console
cd frontend/angular-products-console && npm run start

# Terminal 4 - Angular CRUD
cd frontend/angular-products-crud && npm run start
```

### Opción 2: URLs de acceso
- Backend API: http://127.0.0.1:8000/docs
- React Console: http://localhost:5173
- Angular Console: http://localhost:4200
- Angular CRUD: http://localhost:4300

---

## Testing de Frontends

### React (Automatizado)
```bash
cd frontend/react-products-console
npm test -- --run
```
**Resultado**: 8 tests passed ✅

### Angular (Requiere configuración)
```bash
cd frontend/angular-products-console
ng test --browsers=ChromeHeadless --watch=false
```

Los archivos de test están listos pero requieren Chrome/ChromeHeadless instalado.

---

## Troubleshooting

### Puerto en uso
Si algún puerto está ocupado:
```bash
# React - cambiar en vite.config.ts
server: { port: 5174 }

# Angular - cambiar en angular.json o usar:
ng serve --port 4201
```

### CORS errors
Verificar que el backend incluya los orígenes correctos en `_cors_origins()` en `app.py`.

### Node modules
Si hay problemas con dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Próximos Pasos

### Mejoras Sugeridas
- [ ] Deploy de frontends a Azure Static Web Apps
- [ ] Autenticación con Azure AD B2C
- [ ] Paginación en listados
- [ ] Filtros y búsqueda
- [ ] Validaciones avanzadas
- [ ] Internacionalización (i18n)
- [ ] Dark mode toggle
- [ ] PWA capabilities

### Documentación Relacionada
- [Testing.md](./Testing.md) - Guía completa de testing
- [Documento_Tecnico.md](./Documento_Tecnico.md) - Arquitectura completa
- [Despliegue_AppService_AzureDevOps.md](./Despliegue_AppService_AzureDevOps.md) - CI/CD
