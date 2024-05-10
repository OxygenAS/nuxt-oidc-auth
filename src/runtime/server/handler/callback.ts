import { callbackEventHandler } from '../lib/oidc'
import { setUserSession } from '../utils/session'
import type { ReturnPath } from '../../types/session'
import { sendRedirect, getCookie, deleteCookie } from 'h3'
export default callbackEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, user)
    const returnPath = JSON.parse(getCookie(event, 'login-return-path') || '{}') as ReturnPath
    const pathString =  returnPath?.path || '/'
    deleteCookie(event, 'login-return-path')
    return sendRedirect(event, pathString)
  }
})
