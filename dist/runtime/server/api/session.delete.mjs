import { eventHandler } from "h3";
import { clearUserSession } from "../utils/session.mjs";
export default eventHandler(async (event) => {
  try {
    await clearUserSession(event);
  } catch {
    console.log("session already cleared");
  }
  return { loggedOut: true };
});
