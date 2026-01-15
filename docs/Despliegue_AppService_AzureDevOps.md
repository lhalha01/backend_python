# Despliegue de FastAPI (Python) a Azure App Service usando Azure DevOps

Este documento describe el proceso recomendado para publicar esta API (FastAPI + Uvicorn) en **Azure App Service (Linux)** usando un **pipeline YAML** en **Azure DevOps**.

## 1) Requisitos

- Suscripción de Azure con permisos para crear:
  - Resource Group
  - App Service Plan (Linux)
  - Web App (Linux)
- Proyecto en Azure DevOps con repositorio conectado.
- Un **Service Connection** (Azure Resource Manager) en Azure DevOps con permisos sobre el Resource Group.

## 2) Preparación de la aplicación

### 2.1 Dependencias

En este repo la app está en `app.py` y depende de:
- `fastapi`
- `uvicorn[standard]`

Recomendación para producción (opcional pero aconsejable): añadir `gunicorn` a `requirements.txt` para un servidor más robusto.

### 2.2 Comando de arranque (Startup Command)

En App Service Linux debes indicar cómo arrancar el servidor.

Opción A (simple):
- `python -m uvicorn app:app --host 0.0.0.0 --port 8000`

Opción B (recomendada en producción si agregas gunicorn):
- `gunicorn -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:8000 --workers 2`

## 3) Crear recursos en Azure (App Service Linux)

Puedes hacerlo desde Azure Portal.

Alternativa (recomendada si quieres automatizar): este repo incluye un pipeline IaC en `azure-pipelines-iac.yml` que crea el Resource Group + App Service Plan + Web App (Linux) y luego despliega el ZIP.

1. Crear un **Resource Group**.
2. Crear un **App Service Plan**:
   - OS: Linux
   - SKU: según tu necesidad (por ejemplo B1 para pruebas)
3. Crear una **Web App**:
   - Publicación: Code
   - Runtime stack: Python 3.11 (o similar)
   - OS: Linux

## 4) Configuración de la Web App (Settings)

En la Web App > **Configuration**:

### 4.1 App settings

Configura (recomendado):
- `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
  - Permite que App Service (Oryx) instale dependencias desde `requirements.txt` al hacer Zip Deploy.
- `WEBSITES_PORT=8000`
  - Para apps que escuchan en 8000.

Según tus necesidades, puedes añadir variables propias (por ejemplo, credenciales a otros servicios). Evita guardar secretos en el repositorio; usa Key Vault o variables secretas en Azure DevOps.

### 4.2 Startup Command

En **General settings** define el comando de arranque (ver sección 2.2).

## 5) Configurar Azure DevOps (Service Connection)

1. En Azure DevOps: **Project settings** → **Service connections**.
2. Crear una conexión:
   - Tipo: **Azure Resource Manager**
   - Authentication: Service principal (automatic o manual)
   - Scope: idealmente el Resource Group del App Service
3. Anota el **nombre** del Service Connection (lo usarás en el YAML).

## 6) Pipeline YAML (Build + Deploy)

Este repo ya incluye un pipeline en `azure-pipelines.yml` con:
- Stage **Build**: instala deps, valida imports/sintaxis, genera un ZIP `app.zip` como artefacto.
- Stage **Deploy**: hace Zip Deploy a App Service (Linux) cuando el build viene de `main` y no es PR.

Si además quieres que el pipeline cree la infraestructura automáticamente, usa `azure-pipelines-iac.yml`.

### 6.1 Variables requeridas

En Azure DevOps, define estas variables (Pipeline variables o Variable Group):
- `azureServiceConnection`: nombre del Service Connection de Azure
- `webAppName`: nombre exacto de la Web App en Azure
- `environmentName`: nombre del entorno (por defecto `prod`)

Para el pipeline IaC (`azure-pipelines-iac.yml`) además necesitas (o ajustar):
- `resourceGroupName`
- `location`
- `appServicePlanName`
- `appServicePlanSkuName`
- `appInsightsName` (si `enableAppInsights=true`)

También puedes dejarlas hardcodeadas en YAML, pero es preferible configurarlas como variables.

## 7) Publicar (ejecución del despliegue)

1. Haz push/merge a `main`.
2. Azure DevOps ejecuta el pipeline.
3. Si el stage **Build** termina correctamente:
   - Se publica `app.zip` como artefacto.
4. El stage **Deploy** se ejecuta automáticamente (si no es un PR):
   - Descarga el artefacto
   - Ejecuta `AzureWebApp@1` para hacer Zip Deploy

## 8) Verificación

- En Azure Portal → Web App → **Overview**:
  - Verifica que la app está “Running”.
- Revisa logs:
  - Web App → **Log stream**
  - Deployment Center / Kudu (si aplica)
- Prueba endpoints:
  - `GET /products`
  - `POST /products`

## 9) Problemas comunes

- **La app no responde / 502**:
  - Falta `WEBSITES_PORT` o no coincide con el puerto del servidor.
  - El Startup Command es incorrecto.
- **No instala dependencias**:
  - Falta `SCM_DO_BUILD_DURING_DEPLOYMENT=true`.
  - `requirements.txt` no está en la raíz del ZIP desplegado.
- **Import error al arrancar**:
  - Revisa `Log stream` y valida que el paquete faltante está en `requirements.txt`.

## 10) Siguiente mejora recomendada (opcional)

- Añadir tests y ejecutar `pytest` en el stage Build.
- Añadir `gunicorn` y usar el startup recomendado.
- Despliegue a “staging slot” + swap a producción.
