import type { OidcProviderConfig } from '../types/oidc';
type OidcRequiredFields = 'clientId' | 'clientSecret' | 'authorizationUrl' | 'tokenUrl' | 'redirectUri';
export declare const oidc: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}>, OidcRequiredFields>>;
export {};
