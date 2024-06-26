import { defineOidcProvider } from "./provider.mjs";
export const apple = defineOidcProvider({
  authorizationUrl: "https://appleid.apple.com/auth/oauth2/v2/authorize",
  tokenUrl: "https://appleid.apple.com/auth/oauth2/v2/token",
  userinfoUrl: "",
  tokenRequestType: "json",
  responseType: "code",
  authenticationScheme: "body",
  grantType: "authorization_code",
  scope: ["user:email"],
  pkce: false,
  state: true,
  nonce: false,
  scopeInTokenRequest: false,
  skipAccessTokenParsing: true,
  requiredProperties: [
    "clientId",
    "clientSecret",
    "authorizationUrl",
    "tokenUrl",
    "redirectUri"
  ],
  validateAccessToken: false,
  validateIdToken: false
});
