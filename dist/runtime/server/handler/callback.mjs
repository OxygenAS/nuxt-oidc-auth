import { callbackEventHandler } from "../lib/oidc.mjs";
import { setUserSession } from "../utils/session.mjs";
import { sendRedirect, getCookie } from "h3";
export default callbackEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, user);
    const returnPath = JSON.parse(getCookie(event, "login-return-path") || "{}");
    const overridingPath = JSON.parse(getCookie(event, "login-return-path-override") || "{}");
    const pathString = overridingPath?.path ? overridingPath?.path : returnPath?.path;
    return sendRedirect(event, pathString || "/");
  }
});
