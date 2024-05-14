import { createResolver, defineNuxtModule, useLogger, addImportsDir, addPlugin, addServerPlugin, addServerHandler, extendRouteRules, addRouteMiddleware } from '@nuxt/kit';
import { createDefu, defu } from 'defu';
import { ofetch } from 'ofetch';
import { normalizeURL, withoutTrailingSlash, withHttps, parseURL, cleanDoubleSlashes, joinURL } from 'ufo';
import { existsSync } from 'fs';
import { onDevToolsInitialized, extendServerRpc } from '@nuxt/devtools-kit';

const configMerger = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = key === "requiredProperties" ? Array.from(new Set(obj[key].concat(value))) : value;
    return true;
  }
});
function defineOidcProvider(config = {}) {
  const defaults = {
    clientId: "",
    redirectUri: "",
    clientSecret: "",
    authorizationUrl: "",
    tokenUrl: "",
    responseType: "code",
    authenticationScheme: "header",
    logoutIdTokenParameterName: "id_token_hint",
    logoutIncludeIdToken: false,
    grantType: "authorization_code",
    pkce: false,
    state: true,
    nonce: false,
    scope: ["openid"],
    scopeInTokenRequest: false,
    tokenRequestType: "form",
    requiredProperties: [
      "clientId",
      "redirectUri",
      "clientSecret",
      "authorizationUrl",
      "tokenUrl"
    ],
    validateAccessToken: true,
    validateIdToken: true,
    exposeAccessToken: false,
    exposeIdToken: false
  };
  const mergedConfig = configMerger(config, defaults);
  return mergedConfig;
}

const auth0 = defineOidcProvider({
  responseType: "code",
  tokenRequestType: "json",
  authenticationScheme: "body",
  userinfoUrl: "userinfo",
  grantType: "authorization_code",
  scope: ["openid"],
  pkce: true,
  state: true,
  nonce: false,
  scopeInTokenRequest: false,
  userNameClaim: "",
  authorizationUrl: "authorize",
  tokenUrl: "oauth/token",
  logoutUrl: "",
  requiredProperties: [
    "baseUrl",
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl"
  ],
  async openIdConfiguration(config) {
    const baseUrl = normalizeURL(withoutTrailingSlash(withHttps(config.baseUrl)));
    return await ofetch(`${baseUrl}/.well-known/openid-configuration`);
  },
  validateAccessToken: true,
  validateIdToken: false
});

const entra = defineOidcProvider({
  tokenRequestType: "form-urlencoded",
  responseType: "code",
  authenticationScheme: "header",
  logoutRedirectParameterName: "post_logout_redirect_uri",
  grantType: "authorization_code",
  scope: ["openid"],
  pkce: true,
  state: true,
  nonce: false,
  scopeInTokenRequest: false,
  requiredProperties: [
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl",
    "redirectUri"
  ],
  async openIdConfiguration(config) {
    const parsedUrl = parseURL(config.authorizationUrl);
    const tenantId = parsedUrl.pathname.split("/")[1];
    const openIdConfig = await ofetch(`https://${parsedUrl.host}/${tenantId}/.well-known/openid-configuration${config.audience && `?appid=${config.audience}`}`);
    openIdConfig.issuer = [`https://${parsedUrl.host}/${tenantId}/v2.0`, openIdConfig.issuer];
    return openIdConfig;
  },
  validateAccessToken: false,
  validateIdToken: true
});

const github = defineOidcProvider({
  authorizationUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  userinfoUrl: "https://api.github.com/user",
  tokenRequestType: "json",
  responseType: "code",
  authenticationScheme: "body",
  grantType: "authorization_code",
  scope: ["user:email"],
  pkce: false,
  state: true,
  nonce: false,
  scopeInTokenRequest: false,
  skipAccessTokenParsing: true,
  requiredProperties: [
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl",
    "redirectUri"
  ],
  validateAccessToken: false,
  validateIdToken: false
});

function generateProviderUrl(baseUrl, relativeUrl) {
  const parsedUrl = parseURL(baseUrl);
  return parsedUrl.protocol ? withoutTrailingSlash(cleanDoubleSlashes(joinURL(baseUrl, "/", relativeUrl || ""))) : withoutTrailingSlash(cleanDoubleSlashes(withHttps(joinURL(baseUrl, "/", relativeUrl || ""))));
}

const keycloak = defineOidcProvider({
  authorizationUrl: "protocol/openid-connect/auth",
  tokenUrl: "protocol/openid-connect/token",
  userinfoUrl: "protocol/openid-connect/userinfo",
  tokenRequestType: "form-urlencoded",
  responseType: "code",
  authenticationScheme: "header",
  grantType: "authorization_code",
  pkce: true,
  state: false,
  nonce: true,
  scopeInTokenRequest: false,
  skipAccessTokenParsing: false,
  requiredProperties: [
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl",
    "redirectUri"
  ],
  validateAccessToken: true,
  validateIdToken: false,
  async openIdConfiguration(config) {
    const configUrl = generateProviderUrl(config.baseUrl, ".well-known/openid-configuration");
    return await ofetch(configUrl);
  }
});

const oidc = defineOidcProvider();

const providerPresets = {
  __proto__: null,
  auth0: auth0,
  entra: entra,
  github: github,
  keycloak: keycloak,
  oidc: oidc
};

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
const module = defineNuxtModule({
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

export { module as default };
