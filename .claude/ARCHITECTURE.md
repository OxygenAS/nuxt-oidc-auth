# Architecture

## System Overview

nuxt-oidc-auth is a Nuxt 3 module that implements OIDC authentication entirely server-side, with a thin client-side composable for consuming session state.

## Architecture Pattern

**Server-side auth module with encrypted token storage**

```
+-------------------+     +------------------------+     +------------------+
|   Client (Vue)    |     |   Server (Nitro/h3)    |     |  OIDC Provider   |
|                   |     |                        |     |                  |
| useOidcAuth()     |<--->| Session API            |     |                  |
|   - login()       |     |   GET  /api/_auth/sess |     |                  |
|   - logout()      |     |   DEL  /api/_auth/sess |     |                  |
|   - refresh()     |     |   POST /api/_auth/refr |     |                  |
|   - user (state)  |     |                        |     |                  |
|   - loggedIn      |     | Auth Handlers          |     |                  |
|                   |---->|   /auth/{prov}/login  --+---->| Authorization    |
|                   |     |   /auth/{prov}/callback|<----+| Token endpoint   |
|                   |<----|   /auth/{prov}/logout  --+--->| Logout endpoint  |
|                   |     |                        |     |                  |
| Global Middleware  |     | Session Utils          |     | Userinfo         |
|   oidcAuth.ts     |     |   encrypt/decrypt      |     |                  |
|                   |     |   auto-refresh          |     |                  |
+-------------------+     +------------------------+     +------------------+
                                    |
                          +-------------------+
                          |    unstorage      |
                          | (oidc namespace)  |
                          | Encrypted tokens  |
                          +-------------------+
```

## Module Registration Flow

1. `defineNuxtModule` in `module.ts` registers:
   - Composables directory (`addImportsDir`)
   - Server-side session plugin (`addPlugin`)
   - Default secrets plugin (`addServerPlugin`, optional)
   - Session API handlers (GET/DELETE session, POST refresh)
   - Per-provider handlers (login, callback GET/POST, logout)
   - Route rules for default provider redirects
   - Global auth middleware (optional)
   - DevTools integration

2. Provider config is merged with presets and stored in `runtimeConfig.oidc`

## Token Storage Architecture

```
Session Cookie (nuxt-oidc-auth)     unstorage (oidc namespace)
+---------------------------+       +---------------------------+
| UserSession (public)      |       | PersistentSession         |
|   provider: 'entra'       |       |   accessToken: encrypted  |
|   userName: 'John'        |  ref  |   refreshToken: encrypted |
|   canRefresh: true        |<----->|   idToken: encrypted      |
|   expireAt: 1234567890    |  by   |   exp: 1234567890         |
|   claims: {...}           | sesId |   iat: 1234567800         |
+---------------------------+       +---------------------------+
```

## Provider System

Providers use a preset + config merge pattern:

```
Provider Preset (e.g., entra.ts)
  + User Config (nuxt.config.ts)
  + Environment Variables (NUXT_OIDC_PROVIDERS_*)
  = Final OidcProviderConfig
```

Config merger: custom `defu` that replaces arrays (except `requiredProperties` which are merged).

## Security Layers

1. **Transport**: HTTPS (enforced in production via secure cookies)
2. **CSRF**: State parameter (random, verified on callback)
3. **Code Interception**: PKCE (S256 challenge method)
4. **Replay Attacks**: Nonce (for hybrid flows)
5. **Token Storage**: AES-256-GCM encryption at rest
6. **Session Integrity**: Signed session cookies (3 separate secrets)
7. **Client Isolation**: Tokens never exposed to client by default
