 import { defineEventHandler } from 'h3'
 import { getAccessToken } from '../../../src/runtime/server/utils/session'  
export default defineEventHandler(async (event) => {
try {
  await getAccessToken(event)
  return true
} catch (error) {
  return error
}  

})
