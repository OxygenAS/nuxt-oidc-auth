import * as _nuxt_schema from '@nuxt/schema';

interface Auth0ProviderConfig {
    connection?: string;
    organization?: string;
    invitation?: string;
    loginHint?: string;
}
type Auth0RequiredFields = 'baseUrl' | 'clientId' | 'clientSecret';
declare const auth0: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: Auth0ProviderConfig | undefined;
    additionalTokenParameters?: Auth0ProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: Auth0ProviderConfig | undefined;
    additionalTokenParameters?: Auth0ProviderConfig | undefined;
}>, Auth0RequiredFields>>;

type EntraIdRequiredFields = 'clientId' | 'clientSecret' | 'authorizationUrl' | 'tokenUrl' | 'redirectUri';
interface EntraProviderConfig {
    resource?: string;
    audience?: string;
    prompt?: 'login' | 'none' | 'consent' | 'select_account';
}
declare const entra: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: EntraProviderConfig | undefined;
    additionalTokenParameters?: EntraProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: EntraProviderConfig | undefined;
    additionalTokenParameters?: EntraProviderConfig | undefined;
}>, EntraIdRequiredFields>>;

type GithubRequiredFields = 'clientId' | 'clientSecret' | 'redirectUri';
declare const github: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}>, GithubRequiredFields>>;

type KeycloakRequiredFields = 'baseUrl' | 'clientId' | 'clientSecret' | 'redirectUri';
interface KeycloakProviderConfig {
    realm?: string;
}
declare const keycloak: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: KeycloakProviderConfig | undefined;
    additionalTokenParameters?: KeycloakProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: KeycloakProviderConfig | undefined;
    additionalTokenParameters?: KeycloakProviderConfig | undefined;
}>, KeycloakRequiredFields>>;

type OidcRequiredFields = 'clientId' | 'clientSecret' | 'authorizationUrl' | 'tokenUrl' | 'redirectUri';
declare const oidc: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}>, OidcRequiredFields>>;

declare const _PROVIDERS_auth0: typeof auth0;
declare const _PROVIDERS_entra: typeof entra;
declare const _PROVIDERS_github: typeof github;
declare const _PROVIDERS_keycloak: typeof keycloak;
declare const _PROVIDERS_oidc: typeof oidc;
declare namespace _PROVIDERS {
  export { _PROVIDERS_auth0 as auth0, _PROVIDERS_entra as entra, _PROVIDERS_github as github, _PROVIDERS_keycloak as keycloak, _PROVIDERS_oidc as oidc };
}

type ProviderKeys = keyof typeof _PROVIDERS;
type ProviderConfigs = typeof _PROVIDERS;
type PossibleCombinations<T extends string, U extends string = T> = T extends any ? (T | `${T} ${PossibleCombinations<Exclude<U, T>>}`) : never;
interface OidcProviderConfig {
    /**
     * Client ID - Required by OIDC spec
     */
    clientId: string;
    /**
     * Client Secret
     */
    clientSecret: string;
    /**
     * Response Type - Required by OIDC spec
     * @default 'code'
     */
    responseType: 'code' | 'code token' | 'code id_token' | 'id_token token' | 'code id_token token';
    /**
     * Authentication scheme
     * @default 'header'
     */
    authenticationScheme: 'header' | 'body';
    /**
     * Response mode for authentication request
     * @see https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html
     */
    responseMode: 'query' | 'fragment' | 'form_post' | string;
    /**
     * Authorization endpoint URL
     */
    authorizationUrl: string;
    /**
     * Token endpoint URL
     */
    tokenUrl: string;
    /**
     * Userinfo endpoint URL
     */
    userinfoUrl?: string;
    /**
     * Redirect URI - Required by OIDC spec
     */
    redirectUri: string;
    /**
     * Grant Type
     * @default 'authorization_code'
     */
    grantType: 'authorization_code' | 'refresh_token';
    /**
     * Scope - 'openid' required by OIDC spec
     * @default ['openid']
     * @example ['openid', 'profile', 'email']
     */
    scope?: string[];
    /**
     * Use PKCE (Proof Key for Code Exchange)
     * @default false
     */
    pkce?: boolean;
    /**
     * Use state parameter with a random value. If state is not used, the nonce parameter is used to identify the flow.
     * @default true
     */
    state?: boolean;
    /**
     * Use nonce parameter with a random value.
     * @default false
     */
    nonce?: boolean;
    /**
     * User name claim that is used to get the user name from the access token as a fallback in case the userinfo endpoint is not provided or the userinfo request fails.
     * @default ''
     */
    userNameClaim?: string;
    /**
     * Claims to be extracted from the id token
     * @default []
     */
    optionalClaims?: string[];
    /**
     * Logout endpoint URL
     * @default ''
     */
    logoutUrl?: string;
    /**
     * Logout include id token (only relevant if exposedIdToken is true)
     * @default false
     */
    logoutIncludeIdToken?: boolean;
    /**
     * Query parameter name for id token. Will be appended to the logoutUrl as a query parameter. (only relevant if exposedIdToken is true)
     * @default 'id_token_hint'
     */
    logoutIdTokenParameterName: string;
    /**
     * Include scope in token request
     * @default false
     */
    scopeInTokenRequest?: boolean;
    /**
     * Token request type
     * @default 'form'
     */
    tokenRequestType?: 'form' | 'json' | 'form-urlencoded';
    /**
     * Audience used for token validation (not included in requests by default, use additionalTokenParameters or additionalAuthParameters to add it)
     */
    audience?: string;
    /**
     * Required properties of the configuration that will be validated at runtime
     */
    requiredProperties: (keyof OidcProviderConfig)[];
    /**
     * Filter userinfo response to only include these properties
     */
    filterUserinfo?: string[];
    /**
     * Skip access token parsing (for providers that don't follow the OIDC spec/don't issue JWT access tokens)
     */
    skipAccessTokenParsing?: boolean;
    /**
     * Query parameter name for logout redirect. Will be appended to the logoutUrl as a query parameter.
     */
    logoutRedirectParameterName?: string;
    /**
     * Additional parameters to be added to the authorization request
     */
    additionalAuthParameters?: Record<string, string>;
    /**
     * Additional parameters to be added to the token request
     */
    additionalTokenParameters?: Record<string, string>;
    /**
     * OpenID Configuration object or function promise that resolves to an OpenID Configuration object
     */
    openIdConfiguration?: Record<string, unknown> | ((config: any) => Promise<Record<string, unknown>>);
    /**
     * Validate access token
     * @default true
     */
    validateAccessToken?: boolean;
    /**
     * Validate id token
     * @default true
     */
    validateIdToken?: boolean;
    /**
     * Base URL for the provider, used when to dynamically create authorizationUrl, tokenUrl, userinfoUrl and logoutUrl if possible
     */
    baseUrl?: string;
    /**
     * Space-delimited list of string values that specifies whether the authorization server prompts the user for reauthentication and consent
     */
    prompt?: Array<'none'> | Array<PossibleCombinations<'login' | 'consent' | 'select_account'>>;
    /**
     * Encode redirect uri query parameter in authorization request. Only for compatibility with services that don't implement proper parsing of query parameters.
     * @default false
     */
    encodeRedirectUri?: boolean;
    /**
     * Expose raw access token to the client within session object
     * @default false
     */
    exposeAccessToken?: boolean;
    /**
     * Expose raw id token to the client within session object
     * @default false
     */
    exposeIdToken?: boolean;
}

interface AuthSessionConfig {
    /**
     * Automatically refresh access token and session if refresh token is available (indicated by 'canRefresh' property on user object)
     * @default false
     */
    automaticRefresh?: boolean;
    /**
     * Check if session is expired based on access token exp
     * @default true
     */
    expirationCheck?: boolean;
    /**
     * Amount of seconds before access token expiration to trigger automatic refresh
     * @default 0
     */
    expirationThreshold?: number;
    /**
     * Maximum auth session duration in seconds. Will be refreshed if session is refreshed
     * @default 60 * 60 * 24 (86,400 = 1 day)
     */
    maxAge?: number;
    /**
     * Additional cookie setting overrides
     */
    cookie?: {
        /**
         * Cookie sameSite attribute - In most cases laving at default 'lax' is fine.
         * @default 'lax'
         */
        sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined;
        /**
         * Cookie secure attribute - Consider setting to true for production, enforces https only cookies
         * @default process.env.NODE_ENV === 'production'
         */
        secure?: boolean | undefined;
    };
}

interface ServerFunctions {
    getNuxtOidcAuthSecrets: () => Record<'tokenKey' | 'sessionSecret' | 'authSessionSecret', string>;
}
interface ClientFunctions {
    showNotification: (message: string) => void;
}
interface MiddlewareConfig {
    /**
     * Enables/disables the global middleware
     * @default true
     */
    globalMiddlewareEnabled?: boolean;
    /**
     * Enables/disables automatic registration of '/auth/login' and '/auth/logout' route rules
     * @default false
     */
    customLoginPage?: boolean;
}
interface DevModeConfig {
    /**
     * Enables/disables the dev mode. Dev mode can only be enabled when the app runs in a dev environment.
     * @default false
     */
    enabled?: boolean;
    /**
     * Sets the `userName` field on the user object
     * @default 'Nuxt OIDC Auth Dev'
     */
    userName?: string;
    /**
     * Sets the `providerInfo` field on the user object
     */
    providerInfo?: Record<string, unknown>;
    /**
     * Sets the key algorithm for signing the generated JWT token
     */
    tokenAlgorithm?: 'symmetric' | 'asymmetric';
    /**
     * Sets the `idToken` field on the user object
     */
    idToken?: string;
    /**
     * Sets the `accessToken` field on the user object
     */
    accessToken?: string;
    /**
     * Sets the claims field on the user object and generated JWT token if `generateAccessToken` is set to `true`.
     */
    claims?: Record<string, string>;
    /**
     * If set generates a JWT token for the access_token field based on the given user information
     * @default false
    */
    generateAccessToken?: boolean;
    /**
     * Only used with `generateAccessToken`. Sets the issuer field on the generated JWT token.
     * @default 'nuxt:oidc:auth:issuer
     */
    issuer?: string;
    /**
     * Only used with `generateAccessToken`. Sets the audience field on the generated JWT token.
     * @default 'nuxt:oidc:auth:audience
     */
    audience?: string;
    /**
     * Only used with `generateAccessToken`. Sets the subject field on the generated JWT token.
     * @default 'nuxt:oidc:auth:subject
     */
    subject?: string;
}
interface ModuleOptions {
    /**
     * Enable module
     */
    enabled: boolean;
    /**
     * Enable Nuxt devtools integration
     * @default true
     */
    devtools?: boolean;
    /**
     * Default provider. Will be used with composable if no provider is specified
     */
    defaultProvider?: ProviderKeys;
    /**
     * OIDC providers
     */
    providers: Partial<ProviderConfigs>;
    /**
     * Optional session configuration.
     */
    session: AuthSessionConfig;
    /**
     * Middleware configuration
     */
    middleware: MiddlewareConfig;
    /**
     * Dev mode configuration
     */
    devMode?: DevModeConfig;
    /**
     * Provide defaults for NUXT_OIDC_SESSION_SECRET, NUXT_OIDC_TOKEN_KEY and NUXT_OIDC_AUTH_SESSION_SECRET using a Nitro plugin. Turning this off can lead to the app not working if no secrets are provided.
     * @default true
     */
    provideDefaultSecrets?: boolean;
}
declare module '@nuxt/schema' {
    interface RuntimeConfig {
        oidc: ModuleOptions;
    }
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { type ClientFunctions, type DevModeConfig, type MiddlewareConfig, type ModuleOptions, type ServerFunctions, _default as default };
