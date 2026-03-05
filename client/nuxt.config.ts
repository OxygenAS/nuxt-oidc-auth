import { resolve } from 'pathe'

export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools-ui-kit',
  ],
  ssr: false,
  app: {
    baseURL: '/__nuxt-oidc-auth',
  },
  nitro: {
    output: {
      publicDir: resolve(__dirname, '../dist/client'),
    },
  },
})
