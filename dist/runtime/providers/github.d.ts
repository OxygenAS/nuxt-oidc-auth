import type { OidcProviderConfig } from '../types/oidc';
type GithubRequiredFields = 'clientId' | 'clientSecret' | 'redirectUri';
export declare const github: Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}> & Required<Pick<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: OidcProviderConfig | undefined;
    additionalTokenParameters?: OidcProviderConfig | undefined;
}>, GithubRequiredFields>>;
export {};
