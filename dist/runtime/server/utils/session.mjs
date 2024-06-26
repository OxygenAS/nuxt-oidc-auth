import { useSession, createError, deleteCookie } from "h3";
import { defu } from "defu";
import { createHooks } from "hookable";
import { useRuntimeConfig, useStorage } from "#imports";
import { configMerger, refreshAccessToken, useOidcLogger } from "./oidc.mjs";
import { decryptToken, encryptToken, parseJwtToken } from "./security.mjs";
import * as providerPresets from "../../providers/index.mjs";
const sessionName = "nuxt-oidc-auth";
let sessionConfig;
export const sessionHooks = createHooks();
export async function getUserSession(event) {
  return (await _useSession(event)).data;
}
export async function setUserSession(event, data) {
  const session = await _useSession(event);
  await session.update(defu(data, session.data));
  return session.data;
}
export async function clearUserSession(event) {
  const session = await _useSession(event);
  await sessionHooks.callHookParallel("clear", session.data, event);
  await useStorage("oidc").removeItem(session.id, { removeMeta: true });
  await session.clear();
  deleteCookie(event, sessionName);
  return true;
}
export async function refreshUserSession(event) {
  const session = await _useSession(event);
  const persistentSession = await useStorage("oidc").getItem(session.id);
  if (!session.data.canRefresh || !persistentSession?.refreshToken) {
    throw createError({
      statusCode: 500,
      message: "No refresh token"
    });
  }
  await sessionHooks.callHookParallel("refresh", session.data, event);
  const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
  const refreshToken = await decryptToken(persistentSession.refreshToken, tokenKey);
  const provider = session.data.provider;
  const config = configMerger(useRuntimeConfig().oidc.providers[provider], providerPresets[provider]);
  const { user, tokens, expiresIn } = await refreshAccessToken(refreshToken, config);
  const accessToken = parseJwtToken(tokens.accessToken, providerPresets[provider].skipAccessTokenParsing);
  const updatedPersistentSession = {
    exp: accessToken.exp || Math.trunc(Date.now() / 1e3) + Number.parseInt(expiresIn),
    iat: accessToken.iat || Math.trunc(Date.now() / 1e3),
    accessToken: await encryptToken(tokens.accessToken, tokenKey),
    refreshToken: await encryptToken(tokens.refreshToken, tokenKey),
    idToken: tokens?.idToken ? await encryptToken(tokens.idToken, tokenKey) : void 0
  };
  await useStorage("oidc").setItem(session.id, updatedPersistentSession);
  await session.update(defu(user, session.data));
  return true;
}
export async function requireUserSession(event) {
  const logger = useOidcLogger();
  const session = await _useSession(event);
  const userSession = session.data;
  const config = configMerger(useRuntimeConfig().oidc.providers[userSession.provider], providerPresets[userSession.provider]);
  if (Object.keys(userSession).length === 0) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized"
    });
  }
  const sessionId = session.id;
  const persistentSession = await useStorage("oidc").getItem(sessionId);
  if (config.exposeAccessToken) {
    if (persistentSession) {
      const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
      userSession.accessToken = await decryptToken(persistentSession.accessToken, tokenKey);
    } else {
      logger.warn("Persistent user session not found");
    }
  }
  if (config.exposeIdToken) {
    if (persistentSession) {
      const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
      userSession.idToken = await decryptToken(persistentSession.idToken, tokenKey);
    } else {
      logger.warn("Persistent user session not found");
    }
  }
  if (sessionConfig.expirationCheck) {
    if (!persistentSession) {
      logger.warn("Persistent user session not found, 141");
    }
    let expired = true;
    if (persistentSession) {
      expired = persistentSession?.exp <= Math.trunc(Date.now() / 1e3) + (sessionConfig.expirationThreshold && typeof sessionConfig.expirationThreshold === "number" ? sessionConfig.expirationThreshold : 0);
    } else {
      throw createError({
        statusCode: 401,
        message: "Session not found"
      });
    }
    if (expired) {
      logger.info("Session expired");
      if (sessionConfig.automaticRefresh) {
        await refreshUserSession(event);
        return userSession;
      }
      try {
        await clearUserSession(event);
      } catch (error) {
        console.log("session already cleared");
      }
      throw createError({
        statusCode: 401,
        message: "Session expired"
      });
    }
  }
  return userSession;
}
export async function getUserSessionId(event) {
  return (await _useSession(event)).id;
}
export async function getAccessToken(event) {
  await requireUserSession(event);
  const sessionId = await getUserSessionId(event);
  const persistentSession = await useStorage("oidc").getItem(sessionId);
  const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
  const accessToken = await decryptToken(persistentSession.accessToken, tokenKey);
  return accessToken || null;
}
function _useSession(event) {
  if (!sessionConfig) {
    sessionConfig = defu({ password: process.env.NUXT_OIDC_SESSION_SECRET, name: sessionName }, useRuntimeConfig(event).oidc.session);
  }
  return useSession(event, sessionConfig);
}
