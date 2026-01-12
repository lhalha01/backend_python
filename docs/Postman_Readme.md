# Guía: Probar el backend con Postman

Este documento explica cómo importar y usar la colección Postman para probar la API REST del proyecto.

Archivos incluidos
- `postman_collection.json` — colección para importar en Postman.

Variables recomendadas
- `base_url`: URL base de la API. Por defecto `http://127.0.0.1:8000`.
- (opcional) `product_id`: id del producto creado. Puedes guardarlo manualmente o usar Postman tests para extraerlo de la respuesta del POST.

Pasos rápidos
1. Abre Postman.
2. Importa `docs/postman_collection.json` (File → Import → Upload Files).
3. Crea o edita un entorno (Environment) con la variable `base_url` apuntando a `http://127.0.0.1:8000`. Opcionalmente añade `product_id` vacío.
4. Selecciona la colección importada y ejecuta las peticiones en este orden:
   - `List Products` (GET)
   - `Create Product` (POST)
   - `Get Product by ID` (GET)
   - `Update Product` (PUT)
   - `Delete Product` (DELETE)

Descripción de las peticiones

1) List Products
- Método: GET
- URL: `{{base_url}}/products`
- Respuesta esperada: `200 OK`, arreglo JSON (puede ser vacío)

2) Create Product
- Método: POST
- URL: `{{base_url}}/products`
- Body (raw JSON):
  {
    "name": "Lapiz",
    "price": 1.5,
    "stock": 10
  }
- Respuesta esperada: `201 Created`, objeto JSON con `id`, `name`, `price`, `stock`

3) Get Product by ID
- Método: GET
- URL: `{{base_url}}/products/:id` (usa el `id` devuelto por Create o la variable `product_id` del entorno)
- Respuesta esperada: `200 OK` con el objeto del producto

4) Update Product
- Método: PUT
- URL: `{{base_url}}/products/:id`
- Body (raw JSON) ejemplo:
  { "price": 2.0 }
- Respuesta esperada: `200 OK` con el producto actualizado

5) Delete Product
- Método: DELETE
- URL: `{{base_url}}/products/:id`
- Respuesta esperada: `200 OK` y mensaje de confirmación

Notas y pruebas adicionales
- Probar validaciones: enviar `price` negativo o `stock` negativo y esperar `422 Unprocessable Entity`.
- Si el servidor no está corriendo, arranca con:

```powershell
.\.venv\Scripts\Activate.ps1
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Ejecutar colección con Newman:

```bash
newman run docs/postman_collection.json --env-var base_url=http://127.0.0.1:8000
```

Soporte
- Si quieres, puedo ejecutar las pruebas automáticas desde aquí y pegarte las respuestas, o exportar la colección en formato compatible con Newman para correr en CI.
