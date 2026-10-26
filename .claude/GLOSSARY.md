# Glossary

## OIDC / OAuth Terms

| Term | Definition |
|------|-----------|
| **OIDC** | OpenID Connect - authentication layer on top of OAuth 2.0 |
| **Authorization Code Flow** | OAuth flow where client receives a code, exchanges it for tokens server-side |
| **PKCE** | Proof Key for Code Exchange - prevents authorization code interception attacks |
| **Code Verifier** | Random string generated client-side, used to create code challenge |
| **Code Challenge** | SHA-256 hash of verifier, sent with authorization request |
| **State** | Random value to prevent CSRF attacks during auth flow |
| **Nonce** | Random value to prevent replay attacks (used in hybrid flows) |
| **Hybrid Flow** | OIDC flow returning both code and tokens in the authorization response |
| **ID Token** | JWT containing user identity claims |
| **Access Token** | Token used to access protected resources |
| **Refresh Token** | Long-lived token used to obtain new access tokens |
| **JWKS** | JSON Web Key Set - public keys used to verify JWT signatures |
| **Claims** | Name-value pairs in a JWT token (e.g., `sub`, `email`, `name`) |
| **Scope** | Permissions requested during authorization (e.g., `openid`, `profile`) |
| **Userinfo Endpoint** | Provider endpoint returning user profile information |

## Project-Specific Terms

| Term | Definition |
|------|-----------|
| **Provider Preset** | Default configuration for a specific OIDC provider (auth0, entra, etc.) |
| **PersistentSession** | Server-side encrypted storage of tokens (access, refresh, id) |
| **UserSession** | Public session data stored in cookie (no sensitive tokens) |
| **AuthSession** | Temporary session (5min) holding state/nonce/codeVerifier during auth flow |
| **configMerger** | Custom defu merger that replaces arrays (except requiredProperties) |
| **TokenKey** | AES-256 encryption key for token storage (`NUXT_OIDC_TOKEN_KEY`) |
| **Authentication Scheme** | How client credentials are sent: `header` (Basic auth) or `body` |
| **Token Request Type** | Format of token request body: `form`, `json`, or `form-urlencoded` |

## Provider Names

| Key | Provider |
|-----|----------|
| `auth0` | Auth0 by Okta |
| `entra` | Microsoft Entra ID (formerly Azure AD) |
| `github` | GitHub OAuth (not full OIDC) |
| `keycloak` | Keycloak open-source IAM |
| `oidc` | Generic OIDC provider |
