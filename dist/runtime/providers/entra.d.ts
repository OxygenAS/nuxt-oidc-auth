import type { OidcProviderConfig } from '../types/oidc.js';
type EntraIdRequiredFields = 'clientId' | 'clientSecret' | 'authorizationUrl' | 'tokenUrl' | 'redirectUri';
interface EntraProviderConfig {
    resource?: string;
    audience?: string;
    prompt?: 'login' | 'none' | 'consent' | 'select_account';
}
export declare const entra: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: EntraProviderConfig | undefined;
    additionalTokenParameters?: EntraProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: EntraProviderConfig | undefined;
    additionalTokenParameters?: EntraProviderConfig | undefined;
}>, EntraIdRequiredFields>>;
export {};
