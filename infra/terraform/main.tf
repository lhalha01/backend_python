locals {
  effective_workspace_name = coalesce(var.log_analytics_workspace_name, "${var.web_app_name}-law")
  effective_appinsights    = coalesce(var.app_insights_name, "${var.web_app_name}-ai")

  base_app_settings = {
    SCM_DO_BUILD_DURING_DEPLOYMENT = "true"
    ENABLE_ORYX_BUILD              = "true"
    WEBSITES_PORT                  = var.websites_port
  }
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

resource "azurerm_service_plan" "plan" {
  name                = var.app_service_plan_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  os_type  = "Linux"
  sku_name = var.app_service_plan_sku_name

  tags = var.tags
}

resource "azurerm_log_analytics_workspace" "law" {
  count               = var.enable_app_insights ? 1 : 0
  name                = local.effective_workspace_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = var.tags
}

resource "azurerm_application_insights" "ai" {
  count               = var.enable_app_insights ? 1 : 0
  name                = local.effective_appinsights
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.law[0].id
  tags                = var.tags
}

locals {
  app_insights_settings = var.enable_app_insights ? {
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.ai[0].connection_string
  } : {}
}

resource "azurerm_linux_web_app" "app" {
  name                = var.web_app_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.plan.id

  https_only = true
  tags       = var.tags

  site_config {
    always_on        = true
    ftps_state       = "Disabled"
    app_command_line = var.startup_command

    application_stack {
      python_version = var.python_version
    }
  }

  app_settings = merge(local.base_app_settings, local.app_insights_settings)
}
