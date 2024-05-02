import type { OidcProviderConfig } from '../types/oidc';
interface Auth0ProviderConfig {
    connection?: string;
    organization?: string;
    invitation?: string;
    loginHint?: string;
}
type Auth0RequiredFields = 'baseUrl' | 'clientId' | 'clientSecret';
export declare const auth0: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: Auth0ProviderConfig | undefined;
    additionalTokenParameters?: Auth0ProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: Auth0ProviderConfig | undefined;
    additionalTokenParameters?: Auth0ProviderConfig | undefined;
}>, Auth0RequiredFields>>;
export {};
