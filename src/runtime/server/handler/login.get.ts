import { loginEventHandler } from '../lib/oidc'
import { sendRedirect } from 'h3'

export default loginEventHandler({
  async onSuccess(event) {
    console.log('login eventhandler')
    return sendRedirect(event, '/')
  }
})
