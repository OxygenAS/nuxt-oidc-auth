import { callbackEventHandler } from "../lib/oidc.mjs";
import { getUserSessionId, setUserSession, getUserSession } from "../utils/session.mjs";
import { useStorage } from "#imports";
import { sendRedirect, getCookie, deleteCookie } from "h3";
export default callbackEventHandler({
  async onSuccess(event, { user, persistentSession = null }) {
    await setUserSession(event, user);
    const session = await getUserSession(event);
    console.log("Session after setting user:", session);
    if (persistentSession) {
      const sessionId = await getUserSessionId(event);
      await useStorage("oidc").setItem(sessionId, persistentSession);
    }
    const returnPath = JSON.parse(getCookie(event, "login-return-path") || "{}");
    const pathString = returnPath?.path || "/";
    deleteCookie(event, "login-return-path");
    return sendRedirect(event, pathString);
  }
});
