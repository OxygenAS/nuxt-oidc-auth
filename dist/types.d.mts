
import type { ModuleOptions } from './module.js'


declare module '@nuxt/schema' {
  interface NuxtConfig { ['oidc']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['oidc']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['oidc']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['oidc']?: ModuleOptions }
}


export type { auth0, entra, github, keycloak, oidc } from './module.js'
