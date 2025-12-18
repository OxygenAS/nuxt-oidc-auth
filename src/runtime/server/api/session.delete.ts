import { eventHandler } from 'h3'
import { clearUserSession } from '../utils/session'

export default eventHandler(async (event) => {
  try {
    // Clear session
    await clearUserSession(event)
  }
  catch {
    console.log('session already cleared')
  }

  return { loggedOut: true }
})
