import { H3Error, useSession, getRequestHeader, eventHandler, getQuery, sendRedirect, readBody, getRequestURL, deleteCookie } from "h3";
import { withQuery, parseURL, normalizeURL } from "ufo";
import { ofetch } from "ofetch";
import { useRuntimeConfig, useStorage } from "#imports";
import { validateConfig } from "../utils/config.mjs";
import { generateRandomUrlSafeString, generatePkceVerifier, generatePkceCodeChallenge, decryptToken, parseJwtToken, encryptToken, validateToken, genBase64FromString } from "../utils/security.mjs";
import { getUserSessionId, clearUserSession } from "../utils/session.mjs";
import { configMerger, convertObjectToSnakeCase, convertTokenRequestToType, oidcErrorHandler, useOidcLogger } from "../utils/oidc.mjs";
import { SignJWT } from "jose";
import * as providerPresets from "../../providers/index.mjs";
import { subtle } from "uncrypto";
async function useAuthSession(event) {
  const session = await useSession(event, {
    name: "oidc",
    password: process.env.NUXT_OIDC_AUTH_SESSION_SECRET,
    maxAge: 300
    // 5 minutes if for example registration takes place
  });
  return session;
}
export function loginEventHandler({ onError }) {
  const logger = useOidcLogger();
  return eventHandler(async (event) => {
    const provider = event.path.split("/")[2];
    const config = configMerger(useRuntimeConfig().oidc.providers[provider], providerPresets[provider]);
    const validationResult = validateConfig(config, config.requiredProperties);
    if (!validationResult.valid) {
      logger.error(`[${provider}] Missing configuration properties:`, validationResult.missingProperties?.join(", "));
      const error = new H3Error("Invalid configuration");
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const session = await useAuthSession(event);
    await session.update({
      state: generateRandomUrlSafeString(),
      codeVerifier: generatePkceVerifier(),
      redirect: getRequestHeader(event, "referer")
    });
    const query = {
      client_id: config.clientId,
      response_type: config.responseType,
      ...config.state && { state: session.data.state },
      ...config.scope && { scope: config.scope.join(" ") },
      ...config.responseMode && { response_mode: config.responseMode },
      ...config.redirectUri && { redirect_uri: config.redirectUri },
      ...config.prompt && { prompt: config.prompt.join(" ") },
      ...config.pkce && { code_challenge: await generatePkceCodeChallenge(session.data.codeVerifier), code_challenge_method: "S256" },
      ...config.additionalAuthParameters && convertObjectToSnakeCase(config.additionalAuthParameters)
    };
    if (config.responseType.includes("token") || config.nonce) {
      const nonce = generateRandomUrlSafeString();
      await session.update({ nonce });
      query.response_mode = "form_post";
      query.nonce = nonce;
      if (!query.scope?.includes("openid"))
        query.scope = `openid ${query.scope}`;
    }
    return sendRedirect(
      event,
      config.encodeRedirectUri ? withQuery(config.authorizationUrl, query).replace(query.redirect_uri, encodeURI(query.redirect_uri)) : withQuery(config.authorizationUrl, query),
      200
    );
  });
}
export function callbackEventHandler({ onSuccess, onError }) {
  const logger = useOidcLogger();
  return eventHandler(async (event) => {
    const provider = event.path.split("/")[2];
    const config = configMerger(useRuntimeConfig().oidc.providers[provider], providerPresets[provider]);
    const validationResult = validateConfig(config, config.requiredProperties);
    if (!validationResult.valid) {
      logger.error(`[${provider}] Missing configuration properties: `, validationResult.missingProperties?.join(", "));
      const error2 = new H3Error("Invalid configuration");
      if (!onError)
        throw error2;
      return onError(event, error2);
    }
    const session = await useAuthSession(event);
    const { code, state, id_token, admin_consent, error, error_description } = event.method === "POST" ? await readBody(event) : getQuery(event);
    if (admin_consent) {
      const url = getRequestURL(event);
      sendRedirect(event, `${url.origin}/auth/${provider}/login`, 200);
    }
    if (id_token) {
      const parsedIdToken = parseJwtToken(id_token);
      if (parsedIdToken.nonce !== session.data.nonce) {
        oidcErrorHandler(event, "Nonce mismatch", onError);
      }
    }
    if (!code || config.state && !state || error) {
      if (error) {
        logger.error(`[${provider}] ${error}`, error_description && `: ${error_description}`);
      }
      if (!code) {
        oidcErrorHandler(event, "Callback failed, missing code", onError);
      }
      oidcErrorHandler(event, "Callback failed", onError);
    }
    if (config.state && state !== session.data.state) {
      oidcErrorHandler(event, "State mismatch", onError);
    }
    const headers = {};
    if (config.authenticationScheme === "header") {
      const encodedCredentials = genBase64FromString(`${config.clientId}:${config.clientSecret}`);
      headers.authorization = `Basic ${encodedCredentials}`;
    }
    const requestBody = {
      client_id: config.clientId,
      code,
      grant_type: config.grantType,
      ...config.redirectUri && { redirect_uri: config.redirectUri },
      ...config.scopeInTokenRequest && config.scope && { scope: config.scope.join(" ") },
      ...config.pkce && { code_verifier: session.data.codeVerifier },
      ...config.authenticationScheme && config.authenticationScheme === "body" && { client_secret: normalizeURL(config.clientSecret) },
      ...config.additionalTokenParameters && convertObjectToSnakeCase(config.additionalTokenParameters)
    };
    let tokenResponse;
    try {
      tokenResponse = await ofetch(
        config.tokenUrl,
        {
          method: "POST",
          headers,
          body: convertTokenRequestToType(requestBody, config.tokenRequestType ?? void 0)
        }
      );
    } catch (error2) {
      logger.error(error2?.data ?? error2);
      if (error2?.data?.suberror === "consent_required") {
        const consentUrl = `https://login.microsoftonline.com/${parseURL(config.authorizationUrl).pathname.split("/")[1]}/adminconsent?client_id=${config.clientId}`;
        return sendRedirect(
          event,
          consentUrl,
          200
        );
      }
      return oidcErrorHandler(event, "Token request failed", onError);
    }
    let tokens;
    const accessToken = parseJwtToken(tokenResponse.access_token, !!config.skipAccessTokenParsing);
    if ([config.audience, config.clientId].some((audience) => accessToken.aud?.includes(audience)) && (config.validateAccessToken || config.validateIdToken)) {
      const openIdConfiguration = config.openIdConfiguration && typeof config.openIdConfiguration === "object" ? config.openIdConfiguration : await config.openIdConfiguration(config);
      const validationOptions = { jwksUri: openIdConfiguration.jwks_uri, issuer: openIdConfiguration.issuer };
      tokens = {
        accessToken: config.validateAccessToken ? await validateToken(tokenResponse.access_token, validationOptions) : accessToken,
        ...tokenResponse.refresh_token && { refreshToken: tokenResponse.refresh_token },
        ...tokenResponse.id_token && { idToken: config.validateIdToken ? await validateToken(tokenResponse.id_token, { jwksUri: openIdConfiguration.jwks_uri, issuer: openIdConfiguration.issuer }) : parseJwtToken(tokenResponse.id_token) }
      };
    } else {
      tokens = {
        accessToken,
        ...tokenResponse.refresh_token && { refreshToken: tokenResponse.refresh_token },
        ...tokenResponse.id_token && { idToken: parseJwtToken(tokenResponse.id_token) }
      };
    }
    const timestamp = Math.trunc(Date.now() / 1e3);
    const user = {
      canRefresh: !!tokens.refreshToken,
      loggedInAt: timestamp,
      updatedAt: timestamp,
      expireAt: accessToken.exp || timestamp + useRuntimeConfig().oidc.session.maxAge,
      provider
    };
    try {
      if (config.userinfoUrl) {
        const userInfoResult = await ofetch(config.userinfoUrl, {
          headers: {
            Authorization: `${tokenResponse.token_type} ${tokenResponse.access_token}`
          }
        });
        user.providerInfo = config.filterUserinfo ? Object.fromEntries(Object.entries(userInfoResult).filter(([key]) => config.filterUserinfo?.includes(key))) : userInfoResult;
      }
    } catch (error2) {
      logger.warn(`[${provider}] Failed to fetch userinfo`);
    }
    if (config.userNameClaim) {
      user.userName = config.userNameClaim in tokens.accessToken ? tokens.accessToken[config.userNameClaim] : "";
    }
    if (config.optionalClaims && tokens.idToken) {
      const parsedIdToken = tokens.idToken;
      user.claims = {};
      config.optionalClaims.forEach((claim) => parsedIdToken[claim] && (user.claims[claim] = parsedIdToken[claim]));
    }
    let persistentSession;
    if (tokenResponse.refresh_token) {
      const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
      persistentSession = {
        exp: accessToken.exp,
        iat: accessToken.iat,
        accessToken: await encryptToken(tokenResponse.access_token, tokenKey),
        refreshToken: await encryptToken(tokenResponse.refresh_token, tokenKey),
        ...tokenResponse.id_token && { idToken: await encryptToken(tokenResponse.id_token, tokenKey) }
      };
    }
    try {
      clearUserSession(event);
    } catch (error2) {
      console.log("error clearing user session", error2);
    }
    return onSuccess(event, {
      user,
      persistentSession
    });
  });
}
export function logoutEventHandler({ onSuccess }) {
  return eventHandler(async (event) => {
    const provider = event.path.split("/")[2];
    const config = configMerger(useRuntimeConfig().oidc.providers[provider], providerPresets[provider]);
    let idToken;
    if (config.logoutIncludeIdToken) {
      const userSessionId = await getUserSessionId(event);
      const persistentSession = await useStorage("oidc").getItem(userSessionId);
      const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
      idToken = persistentSession?.idToken ? await decryptToken(persistentSession.idToken, tokenKey) : null;
    }
    try {
      await clearUserSession(event);
    } catch (error) {
      console.log("session already cleared");
    }
    if (config.logoutUrl) {
      console.log("logging out", `${config.logoutRedirectURL ? config.logoutRedirectURL : getRequestURL(event).protocol}//${getRequestURL(event).host}`);
    }
    return onSuccess(event, {
      user: void 0
    });
  });
}
export function devEventHandler({ onSuccess }) {
  const logger = useOidcLogger();
  return eventHandler(async (event) => {
    logger.warn("Using dev auth handler with static auth information");
    const session = await useAuthSession(event);
    const timestamp = Math.trunc(Date.now() / 1e3);
    const user = {
      canRefresh: false,
      loggedInAt: timestamp,
      updatedAt: timestamp,
      expireAt: timestamp + 86400,
      // Adding one day
      provider: "dev",
      userName: useRuntimeConfig().oidc.devMode?.userName || "Nuxt OIDC Auth Dev",
      ...useRuntimeConfig().oidc.devMode?.providerInfo && { providerInfo: useRuntimeConfig().oidc.devMode?.providerInfo },
      ...useRuntimeConfig().oidc.devMode?.idToken && { idToken: useRuntimeConfig().oidc.devMode?.idToken },
      ...useRuntimeConfig().oidc.devMode?.accessToken && { accessToken: useRuntimeConfig().oidc.devMode?.accessToken },
      ...useRuntimeConfig().oidc.devMode?.claims && { claims: useRuntimeConfig().oidc.devMode?.claims }
    };
    if (useRuntimeConfig().oidc.devMode?.generateAccessToken) {
      let key;
      let alg;
      if (useRuntimeConfig().oidc.devMode?.tokenAlgorithm === "asymmetric") {
        alg = "RS256";
        const keyPair = await subtle.generateKey(
          {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: { name: "SHA-256" }
          },
          true,
          ["sign", "verify"]
        );
        key = keyPair.privateKey;
      } else {
        alg = "HS256";
        key = new TextEncoder().encode(
          generateRandomUrlSafeString()
        );
      }
      const jwt = await new SignJWT(useRuntimeConfig().oidc.devMode?.claims || {}).setProtectedHeader({ alg }).setIssuedAt().setIssuer(useRuntimeConfig().oidc.devMode?.issuer || "nuxt:oidc:auth:issuer").setAudience(useRuntimeConfig().oidc.devMode?.audience || "nuxt:oidc:auth:audience").setExpirationTime("24h").setSubject(useRuntimeConfig().oidc.devMode?.subject || "nuxt:oidc:auth:subject").sign(key);
      user.accessToken = jwt;
    }
    await session.clear();
    deleteCookie(event, "oidc");
    return onSuccess(event, {
      user
    });
  });
}
export const oidc = {
  loginEventHandler,
  callbackEventHandler,
  logoutEventHandler,
  devEventHandler
};
