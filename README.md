THIS PROJECT IS FORKED AND MODIFIED

- for at installere projektet skal følgende sættes ind i package.json


```js
    "nuxt-oidc-auth": "github:OxygenAS/nuxt-oidc-auth",
```

projektet er udvidet med følgende settings til providersettings (i nuxt config) 
logoutIdTokenParameterName er som default sat til 'id_token_hint', men bliver kun sat på, hvis logoutIncludeToken, er sat til true.
logoutRedirectURL (optional), sættes til den url man skal redirecte tilbage til.

```js
logoutIdTokenParameterName: 'id_token_hint',
logoutIncludeIdToken: true,
```

Et baseline projekt, som bygges i Azure, skal have en pipeline for hvert miljø, hvor følgende variables skal sættes:
```js
NUXT_OIDC_AUTHORITY: 'url til login',
NUXT_PUBLIC_ORIGIN: 'url til miløets frontend/sitet man logger ind på',
```
Derudover skal pipeline sættes op til at inkludere disse som build arguments
Docker filen for frontend projektet skal også opdateres 


Resten af config og dokumentation kan findes på 
https://github.com/itpropro/nuxt-oidc-auth

Tilføjet: mulighed for setting return path ved login - login metoden fra composable tager nu et object {provider, returnPath} begge er optional

På test og produktionsmiljøer, skal der opsættes end blob storage til opbevaring af access tokens.

I FE projektet skal der oprettes et server side plugin, som skal således ud:

```js
// file: /server/plugins/storage.js

import azureBlobDriver from "unstorage/drivers/azure-storage-blob";

export default defineNitroPlugin(() => {
  const storage = useStorage();
  const driver = azureBlobDriver({
    base: "oidc",
    accountName: useRuntimeConfig().accountName,
    sasKey: useRuntimeConfig().sasKey,
    containerName: useRuntimeConfig().containerName,
  });

  // Mount driver
  storage.mount("oidc", driver);
});

```
Plugin'et er afhængigt af pakkerne @azure/identity og @azure/storage-blob.

Derudover kræver det følgende variables:

```js
# # AZURE STORAGE CONFIG
# NUXT_SAS_KEY=/?{Blob SAS token}
# NUXT_CONTAINER_NAME={blob container name}
# NUXT_ACCOUNT_NAME={blob account name}
```
Husk at give shared access key (SAS-key) de nødvendige rettigheder - datoudløb, samt write permissions.
