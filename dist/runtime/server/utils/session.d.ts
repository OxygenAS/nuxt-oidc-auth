import type { H3Event } from 'h3';
import type { UserSession } from '../../types/session';
export interface SessionHooks {
    /**
     * Called when fetching the session from the API
     */
    'fetch': (session: UserSession, event: H3Event) => void | Promise<void>;
    /**
     * Called before clearing the session
     */
    'clear': (session: UserSession, event: H3Event) => void | Promise<void>;
    /**
     * Called before refreshing the session
     */
    'refresh': (session: UserSession, event: H3Event) => void | Promise<void>;
}
export declare const sessionHooks: import("hookable").Hookable<SessionHooks, import("hookable").HookKeys<SessionHooks>>;
export declare function getUserSession(event: H3Event): Promise<UserSession>;
/**
 * Set a user session
 * @param event
 * @param data User session data, please only store public information since it can be decoded with API calls
 */
export declare function setUserSession(event: H3Event, data: UserSession): Promise<UserSession>;
export declare function clearUserSession(event: H3Event): Promise<boolean>;
export declare function refreshUserSession(event: H3Event): Promise<boolean>;
export declare function requireUserSession(event: H3Event): Promise<UserSession>;
export declare function getUserSessionId(event: H3Event): Promise<string>;
export declare function getAccessToken(event: H3Event): Promise<string | null | undefined>;
