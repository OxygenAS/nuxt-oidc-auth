import type { OidcProviderConfig } from '../types/oidc';
type AppleRequiredFields = 'clientId' | 'clientSecret' | 'authorizationUrl' | 'tokenUrl' | 'redirectUri';
export declare const apple: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}>, AppleRequiredFields>>;
export {};
