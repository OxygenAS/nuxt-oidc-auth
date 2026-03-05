# Azure Infrastructure Development Skill

## Bicep Templates
```bicep
param appServiceName string
param location string = resourceGroup().location

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${appServiceName}-plan'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
}

resource appService 'Microsoft.Web/sites@2022-03-01' = {
  name: appServiceName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      netFrameworkVersion: 'v8.0'
      alwaysOn: true
      appSettings: [
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
    }
  }
}

output appServiceUrl string = appService.properties.defaultHostName
```

## Azure DevOps Pipeline
```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Build
    jobs:
      - job: BuildJob
        steps:
          - task: DotNetCoreCLI@2
            inputs:
              command: 'build'
              projects: '**/*.csproj'
          
          - task: DotNetCoreCLI@2
            inputs:
              command: 'test'
              projects: '**/*Tests.csproj'
          
          - task: DotNetCoreCLI@2
            inputs:
              command: 'publish'
              publishWebProjects: true
              arguments: '--output $(Build.ArtifactStagingDirectory)'
          
          - task: PublishBuildArtifacts@1

  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: DeployJob
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'Azure-Connection'
                    appName: '$(appServiceName)'
                    package: '$(Pipeline.Workspace)/**/*.zip'
```

## Key Vault Integration
```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{keyVaultName}.vault.azure.net/"),
    new DefaultAzureCredential()
);
```

## Application Insights
```csharp
builder.Services.AddApplicationInsightsTelemetry(options =>
{
    options.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
});
```

## Service Bus
```csharp
await using var client = new ServiceBusClient(connectionString);
var sender = client.CreateSender(queueName);

await sender.SendMessageAsync(new ServiceBusMessage(JsonSerializer.Serialize(order)));
```

## Best Practices
- Use Bicep/Terraform for infrastructure as code
- Store secrets in Key Vault
- Enable Application Insights monitoring
- Configure health checks
- Use managed identities for authentication
- Implement retry policies
- Tag all resources appropriately
