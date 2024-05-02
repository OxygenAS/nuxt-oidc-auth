import type { H3Event, H3Error } from 'h3';
export interface OAuthConfig<UserSession> {
    onSuccess: (event: H3Event, result: {
        user?: UserSession;
    }) => Promise<void> | void;
    onError?: (event: H3Event, error: H3Error) => Promise<void> | void;
}
