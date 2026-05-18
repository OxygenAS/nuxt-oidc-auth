import { createJiti } from "file:///S:/Solutions/nuxt-oidc-auth/nuxt-oidc-auth/node_modules/.pnpm/jiti@2.6.1/node_modules/jiti/lib/jiti.mjs";

const jiti = createJiti(import.meta.url, {
  "interopDefault": true,
  "alias": {
    "nuxt-oidc-auth": "S:/Solutions/nuxt-oidc-auth/nuxt-oidc-auth"
  },
  "transformOptions": {
    "babel": {
      "plugins": []
    }
  }
})

/** @type {import("S:/Solutions/nuxt-oidc-auth/nuxt-oidc-auth/src/module.js")} */
const _module = await jiti.import("S:/Solutions/nuxt-oidc-auth/nuxt-oidc-auth/src/module.ts");

export default _module?.default ?? _module;