import { callbackEventHandler } from "../lib/oidc.mjs";
import { setUserSession } from "../utils/session.mjs";
import { sendRedirect, getCookie, deleteCookie } from "h3";
export default callbackEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, user);
    console.log("USER", user);
    const returnPath = JSON.parse(getCookie(event, "login-return-path") || "{}");
    const pathString = returnPath?.path || "/";
    deleteCookie(event, "login-return-path");
    return sendRedirect(event, pathString);
  }
});
