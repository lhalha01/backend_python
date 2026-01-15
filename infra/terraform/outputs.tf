output "web_app_name" {
  value = azurerm_linux_web_app.app.name
}

output "web_app_default_hostname" {
  value = azurerm_linux_web_app.app.default_hostname
}

output "app_insights_name" {
  value = var.enable_app_insights ? azurerm_application_insights.ai[0].name : null
}
