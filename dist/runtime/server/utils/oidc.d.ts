import type { H3Event, H3Error } from 'h3';
import type { OidcProviderConfig, RefreshTokenRequest, TokenRequest } from '../../types/oidc';
import type { UserSession } from '../../types/session';
export declare const useOidcLogger: () => import("consola").ConsolaInstance;
export declare const configMerger: <Source extends {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
}, Defaults extends ({
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} | (number | boolean | any[] | Record<never, any> | null | undefined))[]>(source: Source, ...defaults: Defaults) => import("defu").Defu<Source, Defaults>;
export declare function refreshAccessToken(refreshToken: string, config: OidcProviderConfig): Promise<{
    user: UserSession;
    tokens: Record<"refreshToken" | "accessToken" | "idToken", string>;
    expiresIn: string;
}>;
export declare function generateFormDataRequest(requestValues: RefreshTokenRequest | TokenRequest): FormData;
export declare function generateFormUrlEncodedRequest(requestValues: RefreshTokenRequest | TokenRequest): URLSearchParams;
export declare function convertTokenRequestToType(requestValues: RefreshTokenRequest | TokenRequest, requestType?: OidcProviderConfig['tokenRequestType']): TokenRequest | RefreshTokenRequest | URLSearchParams | FormData;
export declare function convertObjectToSnakeCase(object: Record<string, any>): Record<string, any>;
export declare function oidcErrorHandler(event: H3Event, errorText: string, onError?: ((event: H3Event, error: H3Error) => void | Promise<void>), errorCode?: number): void | Promise<void>;
