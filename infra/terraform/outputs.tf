output "resource_group_name" {
  description = "Nombre del Resource Group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_id" {
  description = "ID del Resource Group"
  value       = azurerm_resource_group.main.id
}

output "app_service_name" {
  description = "Nombre del App Service"
  value       = azurerm_linux_web_app.backend.name
}

output "app_service_default_hostname" {
  description = "URL del App Service"
  value       = azurerm_linux_web_app.backend.default_hostname
}

output "app_service_url" {
  description = "URL completa del App Service"
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "static_web_app_name" {
  description = "Nombre del Static Web App"
  value       = azurerm_static_site.frontend.name
}

output "static_web_app_default_hostname" {
  description = "URL del Static Web App"
  value       = azurerm_static_site.frontend.default_host_name
}

output "static_web_app_url" {
  description = "URL completa del Static Web App"
  value       = "https://${azurerm_static_site.frontend.default_host_name}"
}

output "static_web_app_api_key" {
  description = "API Key del Static Web App (sensible)"
  value       = azurerm_static_site.frontend.api_key
  sensitive   = true
}
