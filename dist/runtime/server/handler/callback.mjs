import { callbackEventHandler } from "../lib/oidc.mjs";
import { getUserSessionId, setUserSession } from "../utils/session.mjs";
import { storageDriver } from "../utils/storage.mjs";
import { sendRedirect, getCookie, deleteCookie } from "h3";
export default callbackEventHandler({
  async onSuccess(event, { user, persistentSession = null }) {
    await setUserSession(event, user);
    if (persistentSession) {
      const sessionId = await getUserSessionId(event);
      await storageDriver().setItem(sessionId, persistentSession);
    }
    const returnPath = JSON.parse(getCookie(event, "login-return-path") || "{}");
    const pathString = returnPath?.path || "/";
    deleteCookie(event, "login-return-path");
    console.log("callback-done");
    return sendRedirect(event, pathString);
  }
});
