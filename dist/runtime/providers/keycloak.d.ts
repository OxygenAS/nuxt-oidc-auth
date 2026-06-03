import type { OidcProviderConfig } from '../types/oidc.js';
type KeycloakRequiredFields = 'baseUrl' | 'clientId' | 'clientSecret' | 'redirectUri';
interface KeycloakProviderConfig {
    realm?: string;
}
export declare const keycloak: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: KeycloakProviderConfig | undefined;
    additionalTokenParameters?: KeycloakProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: KeycloakProviderConfig | undefined;
    additionalTokenParameters?: KeycloakProviderConfig | undefined;
}>, KeycloakRequiredFields>>;
export {};
