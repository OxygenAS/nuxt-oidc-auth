import { useOidcAuth, defineNuxtRouteMiddleware } from '#imports'

interface OidcAuthMiddlewareOptions {
  /**
   * Enable or disable auth for this page. Set to `false` to make the page public.
   * @default true
   */
  enabled?: boolean
}

declare module '#app' {
  interface PageMeta {
    oidcAuth?: OidcAuthMiddlewareOptions
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    oidcAuth?: OidcAuthMiddlewareOptions
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Page-level auth disable
  const oidcAuth = to.meta.oidcAuth as OidcAuthMiddlewareOptions | undefined
  if (oidcAuth?.enabled === false) {
    return
  }
  // 404 exclusion
  const isErrorPage = !(to.matched.length > 0)
  if (isErrorPage) {
    return
  }
  const { loggedIn, login } = useOidcAuth()
  if (loggedIn.value === true || to.path.startsWith('/auth')) {
    return
  }
  await login()
})
