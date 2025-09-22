import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'nuxt-oidc-auth'
  ],
  features: {
    inlineStyles: false,
  },
  runtimeConfig: {
  },
  oidc: {
    defaultProvider: 'oidc',
    providers: {
      oidc: {
        clientId: 'realdania_umbraco',
        clientSecret: '46b2fe1055e740bdb8dfe06e509cb425',
        responseType: 'code',
        authorizationUrl:
          process.env.NUXT_OIDC_AUTHORITY + '/connect/authorize',
        userInfoUrl: process.env.NUXT_OIDC_AUTHORITY + '/connect/userInfo',
        redirectUri: process.env.NUXT_PUBLIC_ORIGIN + '/auth/oidc/callback',
        grantType: 'authorization_code',
        scope: [
          'realdania_website',
          'realdania_application',
          'openid',
          'profile',
          'offline_access',
          'membershipData',
        ],
        logoutUrl: process.env.NUXT_OIDC_AUTHORITY + '/connect/endsession',
        responseMode: 'query',
        tokenUrl: process.env.NUXT_OIDC_AUTHORITY + '/connect/token',
        authenticationScheme: 'body',
        tokenRequestType: 'form-urlencoded',
        exposeAccessToken: false,
        logoutRedirectParameterName: 'post_logout_redirect_uri',
        logoutIdTokenParameterName: 'id_token_hint',
        logoutRedirectURL: process.env.NUXT_PUBLIC_ORIGIN,
        logoutIncludeIdToken: true,
        exposeIdToken: false,
      },
    },
    session: {
      expirationCheck: true,
      automaticRefresh: true,
    },
    middleware: {
      globalMiddlewareEnabled: true,
      customLoginPage: false,
    },
  },
  imports: {
    autoImport: true
  },
  nitro: {
    preset: 'node-server',
     storage: { // Local file system storage for demo purposes
       oidc: {
         driver: 'fs',
         base: 'playground/oidcstorage'
       }
     }
  },
})
