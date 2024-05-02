import type { OAuthConfig } from '../../types/config';
import type { UserSession } from '../../types/session';
export declare function loginEventHandler({ onError }: OAuthConfig<UserSession>): import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<void>>;
export declare function callbackEventHandler({ onSuccess, onError }: OAuthConfig<UserSession>): import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<void>>;
export declare function logoutEventHandler({ onSuccess }: OAuthConfig<UserSession>): import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<void>>;
export declare function devEventHandler({ onSuccess }: OAuthConfig<UserSession>): import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<void>>;
export declare const oidc: {
    loginEventHandler: typeof loginEventHandler;
    callbackEventHandler: typeof callbackEventHandler;
    logoutEventHandler: typeof logoutEventHandler;
    devEventHandler: typeof devEventHandler;
};
