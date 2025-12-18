import { createResolver, defineNuxtModule, useLogger, addImportsDir, addPlugin, addServerPlugin, addServerHandler, extendRouteRules, addRouteMiddleware } from '@nuxt/kit';
import { defu } from 'defu';
import * as providerPresets from '../dist/runtime/providers/index.mjs';
import { generateProviderUrl } from '../dist/runtime/server/utils/config.mjs';
import { existsSync } from 'node:fs';
import { onDevToolsInitialized, extendServerRpc } from '@nuxt/devtools-kit';

const DEVTOOLS_UI_ROUTE = "/__nuxt-oidc-auth";
const DEVTOOLS_UI_LOCAL_PORT = 3300;
function setupDevToolsUI(nuxt, resolver) {
  const clientPath = resolver.resolve("./client");
  const isProductionBuild = existsSync(clientPath);
  if (isProductionBuild) {
    nuxt.hook("vite:serverCreated", async (server) => {
      const sirv = await import('sirv').then((r) => r.default || r);
      server.middlewares.use(
        DEVTOOLS_UI_ROUTE,
        sirv(clientPath, { dev: true, single: true })
      );
    });
  } else {
    nuxt.hook("vite:extendConfig", (config) => {
      config.server = config.server || {};
      config.server.proxy = config.server.proxy || {};
      config.server.proxy[DEVTOOLS_UI_ROUTE] = {
        target: "http://localhost:" + DEVTOOLS_UI_LOCAL_PORT + DEVTOOLS_UI_ROUTE,
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(DEVTOOLS_UI_ROUTE, "")
      };
    });
  }
  nuxt.hook("devtools:customTabs", (tabs) => {
    tabs.push({
      name: "nuxt-oidc-auth",
      title: "Nuxt OIDC Auth",
      icon: "carbon:rule-locked",
      view: {
        type: "iframe",
        src: DEVTOOLS_UI_ROUTE
      }
    });
  });
}

const RPC_NAMESPACE = "nuxt-oidc-auth-rpc";
const { resolve } = createResolver(import.meta.url);
const module$1 = defineNuxtModule({
  meta: {
    name: "nuxt-oidc-auth",
    configKey: "oidc",
    compatibility: {
      nuxt: "^3.9.0",
      bridge: false
    }
  },
  defaults: {
    enabled: true,
    session: {
      automaticRefresh: true,
      expirationCheck: true,
      maxAge: 60 * 60 * 24,
      // 1 day
      cookie: {
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      }
    },
    providers: {},
    middleware: {
      globalMiddlewareEnabled: true,
      customLoginPage: false
    },
    provideDefaultSecrets: true,
    devtools: true
  },
  setup(options, nuxt) {
    const logger = useLogger("nuxt-oidc-auth");
    if (!options.enabled) {
      return;
    }
    addImportsDir(resolve("./runtime/composables"));
    addPlugin(resolve("./runtime/plugins/session.server"));
    if (options.provideDefaultSecrets) {
      addServerPlugin(resolve("./runtime/plugins/provideDefaults"));
    }
    if (nuxt.options.nitro.imports !== false) {
      nuxt.options.nitro.imports = defu(nuxt.options.nitro.imports, {
        presets: [
          {
            from: resolve("./runtime/server/utils/session"),
            imports: [
              "sessionHooks"
            ]
          }
        ]
      });
    }
    addServerHandler({
      handler: resolve("./runtime/server/api/session.delete"),
      route: "/api/_auth/session",
      method: "delete"
    });
    addServerHandler({
      handler: resolve("./runtime/server/api/session.get"),
      route: "/api/_auth/session",
      method: "get"
    });
    addServerHandler({
      handler: resolve("./runtime/server/api/refresh.post"),
      route: "/api/_auth/refresh",
      method: "post"
    });
    const providers = Object.keys(options.providers);
    if (!options.defaultProvider && providers.length === 1) {
      options.defaultProvider = providers[0];
    }
    if (process.env["NODE_ENV"] && process.env["NODE_ENV"] === "development" && options.devMode?.enabled) {
      extendRouteRules("/auth/login", {
        redirect: {
          to: "/auth/dev/login",
          statusCode: 302
        }
      });
      extendRouteRules("/auth/logout", {
        redirect: {
          to: "/auth/dev/logout",
          statusCode: 302
        }
      });
    } else {
      if (options.defaultProvider && !options.middleware.customLoginPage) {
        extendRouteRules("/auth/login", {
          redirect: {
            to: `/auth/${options.defaultProvider}/login`,
            statusCode: 302
          }
        });
        extendRouteRules("/auth/logout", {
          redirect: {
            to: `/auth/${options.defaultProvider}/logout`,
            statusCode: 302
          }
        });
      }
    }
    if (process.env["NODE_ENV"] && process.env["NODE_ENV"] === "development" && options.devMode?.enabled) {
      addServerHandler({
        handler: resolve("./runtime/server/handler/dev"),
        route: "/auth/dev/login",
        method: "get"
      });
      addServerHandler({
        handler: resolve("./runtime/server/handler/logout.get"),
        route: "/auth/dev/logout",
        method: "get"
      });
    }
    providers.forEach((provider) => {
      const baseUrl = process.env[`NUXT_OIDC_PROVIDERS_${provider.toUpperCase()}_BASE_URL`] || options.providers[provider].baseUrl;
      if (baseUrl) {
        options.providers[provider].authorizationUrl = generateProviderUrl(baseUrl, providerPresets[provider].authorizationUrl);
        options.providers[provider].tokenUrl = generateProviderUrl(baseUrl, providerPresets[provider].tokenUrl);
        options.providers[provider].userinfoUrl = generateProviderUrl(baseUrl, providerPresets[provider].userinfoUrl);
      }
      addServerHandler({
        handler: resolve("./runtime/server/handler/login.get"),
        route: `/auth/${provider}/login`,
        method: "get"
      });
      addServerHandler({
        handler: resolve("./runtime/server/handler/callback"),
        route: `/auth/${provider}/callback`,
        method: "get"
      });
      addServerHandler({
        handler: resolve("./runtime/server/handler/callback"),
        route: `/auth/${provider}/callback`,
        method: "post"
      });
      addServerHandler({
        handler: resolve("./runtime/server/handler/logout.get"),
        route: `/auth/${provider}/logout`,
        method: "get"
      });
    });
    !nuxt.options._prepare && logger.success(`Registered ${providers.length} OIDC providers: ${providers.join(", ")}`);
    if (options.middleware.globalMiddlewareEnabled) {
      addRouteMiddleware({
        name: "00.auth",
        path: resolve("runtime/middleware/oidcAuth"),
        global: true
      });
    }
    onDevToolsInitialized(async () => {
      extendServerRpc(RPC_NAMESPACE, {
        getNuxtOidcAuthSecrets() {
          const tokenKey = process.env["NUXT_OIDC_TOKEN_KEY"] || "";
          const sessionSecret = process.env["NUXT_OIDC_SESSION_SECRET"] || "";
          const authSessionSecret = process.env["NUXT_OIDC_AUTH_SESSION_SECRET"] || "";
          return {
            tokenKey,
            sessionSecret,
            authSessionSecret
          };
        }
      });
    });
    if (options.devtools)
      setupDevToolsUI(nuxt, createResolver(import.meta.url));
    nuxt.options.runtimeConfig.oidc = defu(
      nuxt.options.runtimeConfig.oidc,
      {
        ...options
      }
    );
  }
});

export { module$1 as default };
