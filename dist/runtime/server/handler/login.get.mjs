import { loginEventHandler } from "../lib/oidc.mjs";
import { sendRedirect } from "h3";
export default loginEventHandler({
  async onSuccess(event) {
    return sendRedirect(event, "/");
  }
});
