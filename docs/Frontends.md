# Frontends

Este repo incluye dos frontends de ejemplo para consumir la API FastAPI de productos.

## Backend (FastAPI)
- Arranque típico:
  - `uvicorn app:app --reload --port 8000`
- Swagger/OpenAPI:
  - `http://127.0.0.1:8000/docs`

### CORS
El backend permite CORS para desarrollo desde:
- `http://localhost:4200` (Angular)
- `http://localhost:5173` (React)

Opcionalmente, puedes sobreescribir orígenes con:
- `CORS_ALLOW_ORIGINS=http://localhost:4200,http://localhost:5173`

## React (Vite)
Proyecto: `frontend/react-products-console`

```bash
cd frontend/react-products-console
npm install
npm run dev
```

Configura la URL del backend en `.env` (ver `.env.example`).

## Angular
Proyecto: `frontend/angular-products-console`

```bash
cd frontend/angular-products-console
npm install
npm run start
```

Configura la URL del backend en `src/environments/environment.ts`.
