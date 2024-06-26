import { useSession, createError, deleteCookie } from 'h3'
import { defu } from 'defu'
import { createHooks } from 'hookable'
// @ts-expect-error - Missing types for nitro exports in Nuxt (useStorage)
import { useRuntimeConfig, useStorage } from '#imports'
import { configMerger, refreshAccessToken, useOidcLogger } from './oidc'
import { decryptToken, encryptToken, parseJwtToken } from './security'
import * as providerPresets from '../../providers'
import type { H3Event } from 'h3'
import type { SessionConfig } from 'h3'
import type { AuthSessionConfig, UserSession } from '../../types/session'
import type { OidcProviderConfig, PersistentSession, ProviderKeys } from '../../types/oidc'

const sessionName = 'nuxt-oidc-auth'
let sessionConfig: SessionConfig & AuthSessionConfig

export interface SessionHooks {
  /**
   * Called when fetching the session from the API
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
  // this is the persistent user session
  await useStorage('oidc').removeItem(session.id as string, { removeMeta: true })
  await session.clear()
  deleteCookie(event, sessionName)

  return true
}

export async function refreshUserSession(event: H3Event) {
  const session = await _useSession(event)
  const persistentSession = await useStorage('oidc').getItem<PersistentSession>(session.id as string) as PersistentSession | null

  if (!session.data.canRefresh || !persistentSession?.refreshToken) {
    // TODO - maybe login again?
    throw createError({
      statusCode: 500,
      message: 'No refresh token'
    })
  }
  await sessionHooks.callHookParallel('refresh', session.data, event)

  // Refresh the access token
  const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY as string
  const refreshToken = await decryptToken(persistentSession.refreshToken, tokenKey)

  const provider = session.data.provider as ProviderKeys
  const config = configMerger(useRuntimeConfig().oidc.providers[provider] as OidcProviderConfig, providerPresets[provider])
  const { user, tokens, expiresIn } = await refreshAccessToken(refreshToken, config as OidcProviderConfig)

  // Replace the session storage
  const accessToken = parseJwtToken(tokens.accessToken, providerPresets[provider].skipAccessTokenParsing)

  const updatedPersistentSession: PersistentSession = {
    exp: accessToken.exp || Math.trunc(Date.now() / 1000) + Number.parseInt(expiresIn),
    iat: accessToken.iat || Math.trunc(Date.now() / 1000),
    accessToken: await encryptToken(tokens.accessToken, tokenKey),
    refreshToken: await encryptToken(tokens.refreshToken, tokenKey),
    idToken: tokens?.idToken ? await encryptToken(tokens.idToken, tokenKey) : undefined as any
  }

  await useStorage('oidc').setItem<PersistentSession>(session.id as string, updatedPersistentSession)
  await session.update(defu(user, session.data))

  return true
}

export async function requireUserSession(event: H3Event) {
  const logger = useOidcLogger()
  const session = await _useSession(event)
  const userSession = session.data
  const config = configMerger(useRuntimeConfig().oidc.providers[userSession.provider] as OidcProviderConfig, providerPresets[userSession.provider])

  if (Object.keys(userSession).length === 0) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const sessionId = session.id
  const persistentSession = await useStorage('oidc').getItem<PersistentSession>(sessionId as string) as PersistentSession | null

  // Expose access token
  if (config.exposeAccessToken) {
    if (persistentSession) {
      const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY as string
      userSession.accessToken = await decryptToken(persistentSession.accessToken, tokenKey)

    } else {
      logger.warn('Persistent user session not found')
    }
  }
  if (config.exposeIdToken) {

    if (persistentSession) {
      const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY as string
      userSession.idToken = await decryptToken(persistentSession.idToken, tokenKey)
    } else {
      logger.warn('Persistent user session not found')
    }
  }

  // Expiration check
  if (sessionConfig.expirationCheck) {
    if (!persistentSession) {
      logger.warn('Persistent user session not found, 141')
    }

    let expired = true
    if (persistentSession) {
      expired = persistentSession?.exp <= (Math.trunc(Date.now() / 1000) + (sessionConfig.expirationThreshold && typeof sessionConfig.expirationThreshold === 'number' ? sessionConfig.expirationThreshold : 0))
    }
    else {

      throw createError({
        statusCode: 401,
        message: 'Session not found'
      })
    }
    if (expired) {
      logger.info('Session expired')
      // Automatic token refresh
      if (sessionConfig.automaticRefresh) {
        await refreshUserSession(event)

        return userSession
      }
      try {
        // Clear session
        await clearUserSession(event)
      } catch (error) {
        console.log('session already cleared')
      }
      throw createError({
        statusCode: 401,
        message: 'Session expired'
      })
    }
  }
  return userSession
}

export async function getUserSessionId(event: H3Event) {
  return (await _useSession(event)).id as string
}
export async function getAccessToken(event: H3Event) {
  await requireUserSession(event)
  const sessionId = await getUserSessionId(event)
  const persistentSession = await useStorage('oidc').getItem<PersistentSession>(sessionId as string) as PersistentSession | null
  const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY as string
  const accessToken = await decryptToken(persistentSession.accessToken, tokenKey) 
  return accessToken || null
}

function _useSession(event: H3Event) {
  if (!sessionConfig) {
    // @ts-ignore
    sessionConfig = defu({ password: process.env.NUXT_OIDC_SESSION_SECRET, name: sessionName }, useRuntimeConfig(event).oidc.session)
  }
  return useSession<UserSession>(event, sessionConfig)
}