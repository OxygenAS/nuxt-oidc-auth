import { eventHandler } from 'h3'
import { clearUserSession } from '../utils/session'
import { useOidcLogger } from '../utils/oidc'

export default eventHandler(async (event) => {
  const logger = useOidcLogger()
  try {
    await clearUserSession(event)
  }
  catch {
    logger.warn('Session already cleared')
  }

  return { loggedOut: true }
})
