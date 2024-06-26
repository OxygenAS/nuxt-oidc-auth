import { createDefu } from "defu";
const configMerger = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = key === "requiredProperties" ? Array.from(new Set(obj[key].concat(value))) : value;
    return true;
  }
});
export function defineOidcProvider(config = {}) {
  const defaults = {
    clientId: "",
    redirectUri: "",
    clientSecret: "",
    authorizationUrl: "",
    tokenUrl: "",
    responseType: "code",
    authenticationScheme: "header",
    logoutIdTokenParameterName: "id_token_hint",
    logoutIncludeIdToken: false,
    grantType: "authorization_code",
    pkce: false,
    state: true,
    nonce: false,
    scope: ["openid"],
    scopeInTokenRequest: false,
    tokenRequestType: "form",
    requiredProperties: [
      "clientId",
      "redirectUri",
      "clientSecret",
      "authorizationUrl",
      "tokenUrl"
    ],
    validateAccessToken: true,
    validateIdToken: true,
    exposeAccessToken: false,
    exposeIdToken: false
  };
  const mergedConfig = configMerger(config, defaults);
  return mergedConfig;
}
