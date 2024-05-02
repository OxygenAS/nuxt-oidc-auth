import { ofetch } from "ofetch";
import { defineOidcProvider } from "./provider.mjs";
import { generateProviderUrl } from "../server/utils/config.mjs";
export const keycloak = defineOidcProvider({
  authorizationUrl: "protocol/openid-connect/auth",
  tokenUrl: "protocol/openid-connect/token",
  userinfoUrl: "protocol/openid-connect/userinfo",
  tokenRequestType: "form-urlencoded",
  responseType: "code",
  authenticationScheme: "header",
  grantType: "authorization_code",
  pkce: true,
  state: false,
  nonce: true,
  scopeInTokenRequest: false,
  skipAccessTokenParsing: false,
  requiredProperties: [
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl",
    "redirectUri"
  ],
  validateAccessToken: true,
  validateIdToken: false,
  async openIdConfiguration(config) {
    const configUrl = generateProviderUrl(config.baseUrl, ".well-known/openid-configuration");
    return await ofetch(configUrl);
  }
});
