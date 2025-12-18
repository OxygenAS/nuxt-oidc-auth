import type { H3Event, H3Error } from 'h3';
import type { PersistentSession } from './oidc.js';
export interface OAuthConfig<UserSession> {
    onSuccess: (event: H3Event, result: {
        user?: UserSession;
        persistentSession?: PersistentSession;
    }) => Promise<void> | void;
    onError?: (event: H3Event, error: H3Error) => Promise<void> | void;
}
