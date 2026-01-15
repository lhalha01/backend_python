# Documento Funcional - Backend Python con Frontends

## Propósito
Este documento describe el comportamiento funcional completo del sistema de gestión de productos, incluyendo el backend API y sus interfaces frontend. Está pensado para equipos de producto, QA y desarrollo.

## Alcance del Sistema
- **Backend API**: Gestión CRUD de `products` con campos: `id`, `name`, `price`, `stock`.
- **API REST**: FastAPI con SQLite como base de datos.
- **Frontends**: 
  - React Console (Vite + TypeScript) - Puerto 5173
  - Angular Console (Standalone) - Puerto 4200  
  - Angular CRUD (Standalone) - Puerto 4300
- **Testing**: Suite completa de tests automatizados (Backend + React)
- **CI/CD**: Azure DevOps Pipelines con infraestructura como código

## Endpoints
- GET `/products`
  - Descripción: Lista todos los productos.
  - Respuesta: `200 OK`, cuerpo: lista JSON de objetos `{id, name, price, stock}`.

- GET `/products/<id>`
  - Descripción: Obtiene un producto por su `id`.
  - Respuesta: `200 OK` + objeto JSON; `404 Not Found` si no existe.

- POST `/products`
  - Descripción: Crea un nuevo producto.
  - Payload (JSON): `{ "name": "string", "price": número > 0, "stock": entero >= 0 }`
  - Respuestas:
    - `201 Created` con el objeto creado `{id, name, price, stock}` (JSON).
    - `422 Unprocessable Entity` si faltan campos o son inválidos — cuerpo JSON con clave `detail`.
    - `500 Internal Server Error` en fallo de DB — cuerpo JSON con `detail` genérico.

- PUT `/products/<id>`
  - Descripción: Actualiza campos de un producto (parcialmente permitido).
  - Payload: alguno de `{ "name": "...", "price": número, "stock": entero }`.
  - Respuestas:
    - `200 OK` con el producto actualizado (JSON).
    - `400 Bad Request` si el body no contiene campos actualizables — respuesta JSON con `detail`.
    - `422 Unprocessable Entity` si valores inválidos — respuesta JSON con `detail`.
    - `404 Not Found` si no existe.
    - `500 Internal Server Error` en fallo de DB.

- DELETE `/products/<id>`
  - Descripción: Elimina un producto por `id`.
  - Respuestas:
    - `200 OK` con un JSON: `{ "message": "Producto eliminado" }`.
    - `404 Not Found` si no existe.
    - `500 Internal Server Error` en fallo de DB.

## Reglas de negocio
- `price` debe ser un número mayor que 0.
- `stock` debe ser un entero >= 0.
- `name` es obligatorio y no debe ser vacío.

## Casos de prueba ejemplo
1. Crear producto válido => esperar `201` y `GET /products` lo muestra.
2. Crear producto con `price` negativo => `422 Unprocessable Entity`.
3. Actualizar `stock` con valor negativo => `422 Unprocessable Entity`.
4. Eliminar producto inexistente => `404 Not Found`.

## Interfaces externas
- No hay integraciones externas en esta versión (solo DB local SQLite).
- **Frontends disponibles**: 
  - React Console en `http://localhost:5173`
  - Angular Console en `http://localhost:4200`
  - Angular CRUD en `http://localhost:4300`

## Arquitectura de Frontends

### React Console (Puerto 5173)
- **Tecnología**: React 18 + Vite + TypeScript
- **Características**:
  - Interfaz tabbed (Productos / Request manual)
  - Tema azul/verde
  - Operaciones CRUD completas
  - Manejo de errores en tiempo real
- **Ubicación**: `frontend/react-products-console/`

### Angular Console (Puerto 4200)
- **Tecnología**: Angular 17 (Standalone Components)
- **Características**:
  - Navegación por botones API (GET, POST, PUT, DELETE)
  - Tema púrpura/rosa con gradientes
  - Prueba individual de cada endpoint
  - Formularios reactivos
- **Ubicación**: `frontend/angular-products-console/`

### Angular CRUD (Puerto 4300)
- **Tecnología**: Angular 17 (Standalone Components)
- **Características**:
  - Vista de tabla con listado de productos
  - Modal para crear/editar productos
  - Tema azul/verde
  - Operaciones CRUD completas con confirmaciones
- **Ubicación**: `frontend/angular-products-crud/`

## Consideraciones de seguridad
- Validar y sanear datos de entrada.
- CORS configurado para desarrollo (localhost:4200, 4300, 5173).
- Para producción, proteger endpoints con autenticación y TLS.
- Variables de entorno para configuración sensible.

## Testing y Calidad
- **Backend**: 11 tests con pytest cubriendo CRUD, validaciones, errores y CORS
- **React**: 8 tests con Vitest cubriendo componentes y servicios API
- **Coverage**: >80% backend, >70% frontend
- **Documentación**: Tests documentados en `docs/Testing.md`

## Anexos: Ejemplos con `curl` (PowerShell)
- Crear:
  curl.exe -s -X POST http://127.0.0.1:8000/products -H "Content-Type: application/json" -d "{\"name\":\"Lapiz\",\"price\":1.5,\"stock\":10}"

- Listar:
  curl.exe -s http://127.0.0.1:8000/products

- Actualizar:
  curl.exe -s -X PUT http://127.0.0.1:8000/products/1 -H "Content-Type: application/json" -d "{\"price\":2.0}"

- Borrar:
  curl.exe -s -X DELETE http://127.0.0.1:8000/products/1
