import { logoutEventHandler } from "../lib/oidc.mjs";
import { sendRedirect } from "h3";
export default logoutEventHandler({
  async onSuccess(event) {
    console.log("hihi");
    return sendRedirect(event, "/", 302);
  }
});
