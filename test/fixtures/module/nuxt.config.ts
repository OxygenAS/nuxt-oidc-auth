import { defineNuxtConfig } from 'nuxt/config'
import NuxtOidcAuth from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    NuxtOidcAuth,
  ],
  oidc: {
    defaultProvider: 'github',
    providers: {
      github: {
        redirectUri: 'http://localhost:3000/auth/github/callback',
        clientId: 'CLIENT_ID',
        clientSecret: 'CLIENT_SECRET',
        filterUserinfo: ['login', 'id', 'avatar_url', 'name', 'email'],
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
})
