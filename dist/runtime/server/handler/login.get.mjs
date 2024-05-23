import { loginEventHandler } from "../lib/oidc.mjs";
import { sendRedirect } from "h3";
export default loginEventHandler({
  async onSuccess(event) {
    console.log("login eventhandler");
    return sendRedirect(event, "/");
  }
});
