import { devEventHandler } from "../lib/oidc.mjs";
import { setUserSession } from "../utils/session.mjs";
import { sendRedirect } from "h3";
export default devEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, user);
    return sendRedirect(event, "/");
  }
});
