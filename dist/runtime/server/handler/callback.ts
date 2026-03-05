import { callbackEventHandler } from '../lib/oidc'
import { getUserSessionId, setUserSession } from '../utils/session'
// @ts-expect-error - Missing types for nitro exports in Nuxt (useStorage)
import { useStorage } from '#imports'
import type { PersistentSession } from '../../types/oidc'
import type { ReturnPath, UserSession } from '../../types/session'
import { sendRedirect, getCookie, deleteCookie } from 'h3'

export default callbackEventHandler({
  async onSuccess(event, { user, persistentSession = null }) {
    await setUserSession(event, user as UserSession)

    if (persistentSession) {
      const sessionId = await getUserSessionId(event)
      await useStorage('oidc').setItem<PersistentSession>(sessionId as string, persistentSession)
    }
    const returnPath = JSON.parse(getCookie(event, 'login-return-path') || '{}') as ReturnPath
    const pathString = returnPath?.path || '/'
    deleteCookie(event, 'login-return-path')
    return sendRedirect(event, pathString)
  },
})
