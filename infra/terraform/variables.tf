variable "location" {
  description = "Azure region"
  type        = string
}

variable "resource_group_name" {
  description = "Resource Group donde se despliega la app"
  type        = string
}

variable "app_service_plan_name" {
  description = "Nombre del App Service Plan (Linux)"
  type        = string
}

variable "app_service_plan_sku_name" {
  description = "SKU del App Service Plan (B1, P1v3, etc.)"
  type        = string
  default     = "B1"
}

variable "web_app_name" {
  description = "Nombre de la Web App (único globalmente)"
  type        = string
}

variable "python_version" {
  description = "Versión de Python para Linux App Service (ej: 3.11)"
  type        = string
  default     = "3.11"
}

variable "websites_port" {
  description = "Puerto donde escucha la app"
  type        = string
  default     = "8000"
}

variable "startup_command" {
  description = "Startup command para App Service Linux"
  type        = string
  default     = "gunicorn -k uvicorn.workers.UvicornWorker app:app --bind=0.0.0.0:8000"
}

variable "enable_app_insights" {
  description = "Crear Application Insights y Log Analytics"
  type        = bool
  default     = true
}

variable "log_analytics_workspace_name" {
  description = "Nombre del Log Analytics Workspace (si enable_app_insights=true)"
  type        = string
  default     = null
}

variable "app_insights_name" {
  description = "Nombre de Application Insights (si enable_app_insights=true)"
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags comunes"
  type        = map(string)
  default     = {}
}
