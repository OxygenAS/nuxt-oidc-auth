import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'nuxt-oidc-auth',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
  ],
  imports: {
    autoImport: true,
  },
  devtools: { enabled: true },
  colorMode: {
    classSuffix: '',
    preference: 'dark',
  },
  runtimeConfig: {
    origin: 'http://localhost:3000',
    public: {
      origin: 'http://localhost:3000',
      environment: 'development',
      mediaEndpoint: 'https://localhost:44353',
      it34MapUrl: 'https://testrealdaniamap.it34.com',
      it34Endpoint: 'https://devrealdaniaapi.it34.com',

    },
  },
  features: {
    inlineStyles: false,
  },
  nitro: {
    preset: 'node-server',
    // storage: { // Local file system storage for demo purposes
    //   oidc: {
    //     driver: 'fs',
    //     base: 'playground/oidcstorage'
    //   }
    // }
  },
  oidc: {
    defaultProvider: 'oidc',
    providers: {
      oidc: {
        clientId: 'jubilaeum_website',
        clientSecret: '59f293123c954ba7acc1e69a5d26ecaa',
        responseType: 'code',
        grantType: 'authorization_code',
        scope: ['jubilaeum_website', 'realdania_application', 'openid', 'profile', 'offline_access', 'email'],
        authorizationUrl: process.env.NUXT_OIDC_AUTORITY + '/connect/authorize',
        userinfoUrl: process.env.NUXT_OIDC_AUTORITY + '/connect/userInfo',
        redirectUri: process.env.NUXT_PUBLIC_ORIGIN + '/auth/oidc/callback',
        logoutUrl: process.env.NUXT_OIDC_AUTORITY + '/connect/endsession',
        tokenUrl: process.env.NUXT_OIDC_AUTORITY + '/connect/token',
        responseMode: 'query',
        authenticationScheme: 'body',
        tokenRequestType: 'form-urlencoded',

        logoutRedirectParameterName: 'post_logout_redirect_uri',
        logoutIdTokenParameterName: 'id_token_hint',
        logoutIncludeIdToken: true,
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
  unocss: {
    preflight: true,
  },
})
