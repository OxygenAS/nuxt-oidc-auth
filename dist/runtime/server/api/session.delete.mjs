import { eventHandler } from "h3";
import { clearUserSession } from "../utils/session.mjs";
export default eventHandler(async (event) => {
  console.log("deleting session");
  await clearUserSession(event);
  return { loggedOut: true };
});
