variable "resource_group_name" {
  description = "Nombre del Resource Group"
  type        = string
}

variable "location" {
  description = "Region de Azure"
  type        = string
  default     = "East US"
}

variable "app_service_name" {
  description = "Nombre del App Service para el backend"
  type        = string
}

variable "static_web_app_name" {
  description = "Nombre del Static Web App para el frontend"
  type        = string
}

variable "environment" {
  description = "Ambiente (dev, prod, etc.)"
  type        = string
  default     = "prod"
}

variable "python_version" {
  description = "Version de Python para el App Service"
  type        = string
  default     = "3.11"
}

variable "sku_name" {
  description = "SKU del App Service Plan"
  type        = string
  default     = "B1"
}

variable "static_web_app_sku" {
  description = "SKU del Static Web App"
  type        = string
  default     = "Free"
}

variable "tags" {
  description = "Tags para los recursos"
  type        = map(string)
  default     = {}
}
