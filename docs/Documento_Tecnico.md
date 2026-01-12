# Documento Técnico

## Resumen
Aplicación backend REST escrita en Python (FastAPI) que expone CRUD para `products` y utiliza SQLite como almacenamiento local.

## Estructura del proyecto
- `app.py` — servidor FastAPI (ASGI) y lógica de endpoints.
- `requirements.txt` — dependencias (FastAPI + Uvicorn).
- `.venv/` — entorno virtual (local).
- `products.db` — fichero SQLite (creado en tiempo de ejecución en la raíz del proyecto).
- `docs/` — documentación (esta carpeta).

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
Por defecto corre en `http://127.0.0.1:8000`.

Documentación interactiva:
- Swagger UI: `http://127.0.0.1:8000/docs`
- OpenAPI JSON: `http://127.0.0.1:8000/openapi.json`

El archivo de base de datos se crea en la ruta relativa `./products.db`.

## Despliegue recomendado (producción)
- Usar un servidor ASGI (Uvicorn/Gunicorn con workers ASGI) detrás de un reverse proxy (NGINX).
- Mover la base de datos a un servicio gestionado (Postgres/MySQL) para entornos con concurrencia.
- Configurar variables de entorno para la configuración de runtime (por ejemplo, ruta de DB, nivel de logs, etc.).
- Habilitar TLS y autenticación (JWT/OAuth2) para proteger endpoints.

## Testing
- Tests unitarios: aislar validaciones y utilidades.
- Tests de integración: usar una copia temporal de SQLite o un DB en memoria.
- Pruebas manuales: usar `curl` o Postman para los endpoints listados en el documento funcional.

Ejemplo de ejecución automática con Newman (una vez instalada):
```bash
newman run docs/postman_collection.json --env-var base_url=http://127.0.0.1:8000
```

## Observaciones y mejoras posibles
- Añadir paginación en `GET /products`.
- Añadir índices si la tabla crece.
- Auditoría: almacenar `created_at`, `updated_at`.
- Manejo de concurrencia y migraciones (Alembic) si se cambia a RDBMS.

## Información de contacto
Repositorio y propietario: carpeta local del usuario.
Para dudas, pedir más detalles o querer que genere scripts de despliegue, pruebas o CI/CD.
