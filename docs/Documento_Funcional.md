# Documento Funcional

## Propósito
Este documento describe el comportamiento funcional del backend de inventario (productos). Está pensado para equipos de producto y QA.

## Alcance
- Gestión CRUD de `products` con campos: `id`, `name`, `price`, `stock`.
- API REST simple usando FastAPI y SQLite.

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

## Consideraciones de seguridad
- Validar y sanear datos de entrada.
- Para producción, proteger endpoints con autenticación y TLS.

## Anexos: Ejemplos con `curl` (PowerShell)
- Crear:
  curl.exe -s -X POST http://127.0.0.1:8000/products -H "Content-Type: application/json" -d "{\"name\":\"Lapiz\",\"price\":1.5,\"stock\":10}"

- Listar:
  curl.exe -s http://127.0.0.1:8000/products

- Actualizar:
  curl.exe -s -X PUT http://127.0.0.1:8000/products/1 -H "Content-Type: application/json" -d "{\"price\":2.0}"

- Borrar:
  curl.exe -s -X DELETE http://127.0.0.1:8000/products/1
