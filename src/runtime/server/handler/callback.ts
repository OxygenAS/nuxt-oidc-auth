import { callbackEventHandler } from '../lib/oidc'
import { getUserSessionId, setUserSession } from '../utils/session'
import { storageDriver} from '../utils/storage'
import type { PersistentSession} from '../../types/oidc'


import type { ReturnPath, UserSession } from '../../types/session'
import { sendRedirect, getCookie, deleteCookie } from 'h3'
export default callbackEventHandler({
  async onSuccess(event, { user, persistentSession = null }) {
    await setUserSession(event, user as UserSession)
    if(persistentSession) {
      const sessionId = await getUserSessionId(event)
      await storageDriver().setItem<PersistentSession>(sessionId as string, persistentSession)

    }
    const returnPath = JSON.parse(getCookie(event, 'login-return-path') || '{}') as ReturnPath
    const pathString =  returnPath?.path || '/'
    deleteCookie(event, 'login-return-path')
    console.log('callback-done')
    return sendRedirect(event, pathString)
  }
})
