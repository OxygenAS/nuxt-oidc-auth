 import { defineEventHandler } from 'h3'
 import { getAccessToken, getUserSession } from '../../../src/runtime/server/utils/session'  
export default defineEventHandler(async (event) => {
try {
  const session = await getUserSession(event).data
  if(!session){
    setTimeout(async() => {
      await getAccessToken(event)
    return true
  }, 1000)
  }else{

    await getAccessToken(event)
    return true
  }
  
} catch (error) {
  console.log(error)
  return error
}  
})
