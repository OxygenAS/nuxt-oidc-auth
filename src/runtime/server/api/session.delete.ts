import { eventHandler } from 'h3'
import { clearUserSession } from '../utils/session'

export default eventHandler(async (event) => {
  console.log('deleting session')
  await clearUserSession(event)
  return { loggedOut: true }
})
