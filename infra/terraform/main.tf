# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  tags     = merge(var.tags, { Environment = var.environment })
}

# App Service Plan para el Backend
resource "azurerm_service_plan" "backend" {
  name                = "${var.app_service_name}-plan"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.sku_name

  tags = merge(var.tags, {
    Environment = var.environment
    Component   = "Backend"
  })
}

# App Service para el Backend Python
resource "azurerm_linux_web_app" "backend" {
  name                = var.app_service_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.backend.id

  site_config {
    always_on = true

    application_stack {
      python_version = var.python_version
    }

    cors {
      allowed_origins = [
        "http://localhost:4200",
        "http://localhost:4300",
        "http://localhost:5173",
        "https://${var.static_web_app_name}.azurestaticapps.net"
      ]
      support_credentials = false
    }
  }

  app_settings = {
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "WEBSITE_HTTPLOGGING_RETENTION_DAYS" = "7"
  }

  https_only = true

  tags = merge(var.tags, {
    Environment = var.environment
    Component   = "Backend"
    Technology  = "Python-FastAPI"
  })
}

# Static Web App para el Frontend Angular
resource "azurerm_static_site" "frontend" {
  name                = var.static_web_app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  sku_tier            = var.static_web_app_sku
  sku_size            = var.static_web_app_sku

  tags = merge(var.tags, {
    Environment = var.environment
    Component   = "Frontend"
    Technology  = "Angular"
  })
}
