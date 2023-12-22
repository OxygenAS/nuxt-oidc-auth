import type { H3Event } from 'h3'
import { useSession, createError } from 'h3'
import { defu } from 'defu'
import { createHooks } from 'hookable'
import { useRuntimeConfig } from '#imports'
import type { AuthSessionConfig, PersistentSession, Providers, UserSession } from '#oidc-auth'
import { refreshAccessToken } from './oidc'
import { decryptToken, encryptToken, parseJwtToken } from './security'
import { useLogger } from '@nuxt/kit'
import * as providerConfigs from '../../../providers'

const logger = useLogger('oidc-auth')

export interface SessionHooks {
  /**
   * Called when fetching the session from the API
   * - Add extra properties to the session
   * - Throw an error if the session could not be verified (with a database for example)
   */
  'fetch': (session: UserSession, event: H3Event) => void | Promise<void>
  /**
   * Called before clearing the session
   */
  'clear': (session: UserSession, event: H3Event) => void | Promise<void>
  /**
   * Called before refreshing the session
   */
  'refresh': (session: UserSession, event: H3Event) => void | Promise<void>
}

export const sessionHooks = createHooks<SessionHooks>()

export async function getUserSession(event: H3Event) {
  return (await _useSession(event)).data
}

/**
 * Set a user session
 * @param event
 * @param data User session data, please only store public information since it can be decoded with API calls
 */
export async function setUserSession(event: H3Event, data: UserSession) {
  const session = await _useSession(event)

  await session.update(defu(data, session.data))

  return session.data
}

export async function clearUserSession(event: H3Event) {
  const session = await _useSession(event)

  await sessionHooks.callHookParallel('clear', session.data, event)
  await session.clear()

  return true
}

export async function refreshUserSession(event: H3Event) {
  const session = await _useSession(event)
  const persistentSession = await useStorage('oidc').getItem<PersistentSession>(session.id as string) as PersistentSession

  if (!session.data.canRefresh || !persistentSession.refreshToken) {
    throw createError({
      statusCode: 500,
      message: 'No refresh token'
    })
  }

  await sessionHooks.callHookParallel('refresh', session.data, event)

  // Refresh the access token
  const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY as string
  const refreshToken = await decryptToken(persistentSession.refreshToken, tokenKey)

  const { user, tokens, expiresIn } = await refreshAccessToken(session.data.provider as Providers, refreshToken)

  // Replace the session storage
  const accessToken = parseJwtToken(tokens.accessToken, providerConfigs[session.data.provider as Providers].skipAccessTokenParsing)

  const updatedPersistentSession: PersistentSession = {
    exp: accessToken.exp || Math.trunc(Date.now() / 1000) + Number.parseInt(expiresIn),
    iat: accessToken.iat || Math.trunc(Date.now() / 1000),
    accessToken: await encryptToken(tokens.accessToken, tokenKey),
    refreshToken: await encryptToken(tokens.refreshToken, tokenKey)
  }

  await useStorage('oidc').setItem<PersistentSession>(session.id as string, updatedPersistentSession)
  await session.update(defu(user, session.data))

  return true
}

export async function requireUserSession(event: H3Event) {
  const userSession = await getUserSession(event)

  if (Object.keys(userSession).length === 0) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Expiration check
  if (sessionConfig.expirationCheck) {
    const sessionId = await getUserSessionId(event)
    const persistentSession = await useStorage('oidc').getItem<PersistentSession>(sessionId as string) as PersistentSession
    if (!persistentSession) {
      logger.warn('Persistent user session not found')
      return userSession
    }
    const expired = persistentSession.exp <= Math.trunc(Date.now() / 1000)
    // logger.info(`Session ${sessionId} expires in ${persistentSession.exp - Math.trunc(Date.now() / 1000)} seconds`)
    if (expired) {
      logger.warn('Session expired')
      if (sessionConfig.automaticRefresh) {
        await refreshUserSession(event)
        return userSession
      }
      await clearUserSession(event)
      throw createError({
        statusCode: 401,
        message: 'Session expired'
      })
      /*
      await sendRedirect(
        event,
        `${getRequestURL(event).protocol}//${getRequestURL(event).host}/auth/${userSession.provider}/logout`,
        302
      ) */
    }
  }

  return userSession
}

export async function getUserSessionId(event: H3Event) {
  return (await _useSession(event)).id as string
}

let sessionConfig: AuthSessionConfig

function _useSession(event: H3Event) {
  if (!sessionConfig) {
    // @ts-ignore
    sessionConfig = defu({ password: process.env.NUXT_OIDC_SESSION_SECRET }, useRuntimeConfig(event).oidc.session)
  }
  return useSession<UserSession>(event, sessionConfig)
}
