import type { ComputedRef } from '#imports';
import type { ProviderKeys } from '../types/oidc';
import type { UserSession } from '../types/session';
export declare const useOidcAuth: () => {
    loggedIn: ComputedRef<boolean>;
    user: ComputedRef<UserSession>;
    currentProvider: ComputedRef<"auth0" | "entra" | "github" | "keycloak" | "oidc" | "dev" | undefined>;
    fetch: () => Promise<void>;
    refresh: () => Promise<void>;
    login: ({ provider, returnPath }?: {
        provider?: ProviderKeys;
        returnPath?: string;
    }) => Promise<void>;
    logout: (provider?: ProviderKeys | "dev") => Promise<void>;
    clear: () => Promise<void>;
};
