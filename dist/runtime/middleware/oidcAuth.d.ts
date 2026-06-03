interface OidcAuthMiddlewareOptions {
    /**
     * Enable or disable auth for this page. Set to `false` to make the page public.
     * @default true
     */
    enabled?: boolean;
}
declare module '#app' {
    interface PageMeta {
        oidcAuth?: OidcAuthMiddlewareOptions;
    }
}
declare module 'vue-router' {
    interface RouteMeta {
        oidcAuth?: OidcAuthMiddlewareOptions;
    }
}
declare const _default: import("#app").RouteMiddleware;
export default _default;
