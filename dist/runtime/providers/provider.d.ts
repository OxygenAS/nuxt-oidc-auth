import type { OidcProviderConfig } from '../types/oidc';
type MakePropertiesRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export declare function defineOidcProvider<TConfig, TRequired extends keyof OidcProviderConfig>(config?: Partial<OidcProviderConfig> & {
    additionalAuthParameters?: TConfig;
    additionalTokenParameters?: TConfig;
}): MakePropertiesRequired<Partial<Partial<OidcProviderConfig> & {
    additionalAuthParameters?: TConfig | undefined;
    additionalTokenParameters?: TConfig | undefined;
}>, TRequired>;
export {};
