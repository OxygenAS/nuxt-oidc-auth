import { callbackEventHandler } from "../lib/oidc.mjs";
import { getUserSessionId, setUserSession } from "../utils/session.mjs";
import { useStorage } from "#imports";
import { sendRedirect, getCookie, deleteCookie } from "h3";
export default callbackEventHandler({
  async onSuccess(event, { user, persistentSession = null }) {
    console.log("on callback success persistent session", persistentSession);
    await setUserSession(event, user);
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
