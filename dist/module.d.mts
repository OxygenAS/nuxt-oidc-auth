import * as _nuxt_schema from '@nuxt/schema';
import { ProviderKeys, ProviderConfigs } from '../dist/runtime/types/oidc.mjs';
import { AuthSessionConfig } from '../dist/runtime/types/session.mjs';

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
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { ClientFunctions, DevModeConfig, MiddlewareConfig, ModuleOptions, ServerFunctions };
