import { callbackEventHandler } from '../lib/oidc'
import { setUserSession } from '../utils/session'
import type { ReturnPath } from '../../types/session'
import { sendRedirect, getCookie } from 'h3'
export default callbackEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, user)
    const returnPath = JSON.parse(getCookie(event, 'login-return-path') || '{}') as ReturnPath
    const overridingPath = JSON.parse(getCookie(event, 'login-return-path-override') || '{}') as ReturnPath
    const pathString = overridingPath?.path ? overridingPath?.path : returnPath?.path 

    return sendRedirect(event, pathString || '/')
  }
})
