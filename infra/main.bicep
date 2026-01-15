targetScope = 'resourceGroup'

@description('Azure region donde se desplegarán los recursos')
param location string = resourceGroup().location

@description('Nombre del App Service Plan (Linux)')
param appServicePlanName string

@description('SKU del App Service Plan, por ejemplo: B1, P1v3')
param appServicePlanSkuName string = 'B1'

@description('Nombre de la Web App (debe ser único a nivel global)')
param webAppName string

@description('Runtime stack para Linux App Service, ej: PYTHON|3.11')
param linuxFxVersion string = 'PYTHON|3.11'

@description('Puerto donde escucha tu app (WEBSITES_PORT)')
param websitesPort string = '8000'

@description('Startup command para App Service Linux (appCommandLine)')
param startupCommand string = 'gunicorn -k uvicorn.workers.UvicornWorker app:app --bind=0.0.0.0:8000'

@description('Crear Application Insights')
param enableAppInsights bool = true

@description('Nombre del recurso de Application Insights')
param appInsightsName string = '${webAppName}-ai'

var baseAppSettings = [
  {
    name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
    value: 'true'
  }
  {
    name: 'ENABLE_ORYX_BUILD'
    value: 'true'
  }
  {
    name: 'WEBSITES_PORT'
    value: websitesPort
  }
]

resource plan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: appServicePlanSkuName
  }
  properties: {
    reserved: true
  }
}

resource insights 'Microsoft.Insights/components@2020-02-02' = if (enableAppInsights) {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

var appInsightsSettings = enableAppInsights ? [
  {
    name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
    value: insights.properties.ConnectionString
  }
] : []

resource site 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: linuxFxVersion
      appCommandLine: startupCommand
      alwaysOn: true
      ftpsState: 'Disabled'
      appSettings: concat(baseAppSettings, appInsightsSettings)
    }
  }
}

output webAppName string = site.name
output webAppDefaultHostName string = site.properties.defaultHostName
output appInsightsName string = enableAppInsights ? insights.name : ''
