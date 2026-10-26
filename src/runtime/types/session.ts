import type { JwtPayload } from '../server/utils/security'
import type { ProviderKeys } from './oidc'

export interface UserSession {
  provider?: ProviderKeys | 'dev'
  canRefresh: boolean
  loggedInAt?: number
  expireAt: number
  updatedAt?: number
  providerInfo?: any
  userName?: string
  claims?: Record<string, unknown>
  accessToken?: string
  idToken?: string
}
export interface ReturnPath {
  path: string
}
export interface Tokens {
  accessToken: JwtPayload
  idToken?: JwtPayload
  refreshToken?: string
}

export interface AuthSessionConfig {
  /**
   * Automatically refresh access token and session if refresh token is available (indicated by 'canRefresh' property on user object)
   * @default false
   */
  automaticRefresh?: boolean
  /**
   * Check if session is expired based on access token exp
   * @default true
   */
  expirationCheck?: boolean
  /**
   * Amount of seconds before access token expiration to trigger automatic refresh
   * @default 0
   */
  expirationThreshold?: number
  /**
   * Maximum auth session duration in seconds. Will be refreshed if session is refreshed
   * @default 60 * 60 * 24 (86,400 = 1 day)
   */
  maxAge?: number
  /**
   * Behavior when a persistent session (server-side token storage) is missing but a session cookie exists.
   * - 'warn': Log a warning and continue (default)
   * - 'clear': Clear the stale session cookie and treat as unauthenticated
   * @default 'warn'
   */
  missingPersistentSession?: 'warn' | 'clear'
  /**
   * Behavior when a session error occurs (expired, missing, unauthorized).
   * - 'throw': Throw an HTTP 401 error (default)
   * - 'redirect': Redirect to '/' with a 302 status
   * @default 'throw'
   */
  sessionErrorBehavior?: 'throw' | 'redirect'
  /**
   * Additional cookie setting overrides
   */
  cookie?: {
    /**
     * Cookie sameSite attribute - In most cases laving at default 'lax' is fine.
     * @default 'lax'
     */
    sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined
    /**
     * Cookie secure attribute - Consider setting to true for production, enforces https only cookies
     * @default process.env.NODE_ENV === 'production'
     */
    secure?: boolean | undefined
    /**
     * Cookie httpOnly attribute - If true, the cookie will be inaccessible to JavaScript's Document.cookie API
     * @default false
     */
    httpOnly?: boolean | undefined
  }
}
