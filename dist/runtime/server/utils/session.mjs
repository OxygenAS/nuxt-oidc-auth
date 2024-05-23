import { useSession, createError, deleteCookie } from "h3";
import { defu } from "defu";
import { createHooks } from "hookable";
import { useRuntimeConfig } from "#imports";
import { storageDriver } from "./storage.mjs";
import { configMerger, refreshAccessToken, useOidcLogger } from "./oidc.mjs";
import { decryptToken, encryptToken, parseJwtToken } from "./security.mjs";
import * as providerPresets from "../../providers/index.mjs";
const sessionName = "nuxt-oidc-auth";
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
  await storageDriver().removeItem(session.id, { removeMeta: true });
  await session.clear();
  deleteCookie(event, sessionName);
  return true;
}
export async function refreshUserSession(event) {
  const session = await _useSession(event);
  console.log("line 66", session.id);
  const persistentSession = await storageDriver().getItem(session.id);
  if (!session.data.canRefresh || !persistentSession?.refreshToken) {
    console.log("line 67");
    throw createError({
      statusCode: 500,
      message: "No refresh token"
    });
  }
  console.log("line 74");
  await sessionHooks.callHookParallel("refresh", session.data, event);
  console.log("line 76");
  const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
  const refreshToken = await decryptToken(persistentSession.refreshToken, tokenKey);
  const provider = session.data.provider;
  const config = configMerger(useRuntimeConfig().oidc.providers[provider], providerPresets[provider]);
  console.log("line 84");
  const { user, tokens, expiresIn } = await refreshAccessToken(refreshToken, config);
  console.log("line 86");
  const accessToken = parseJwtToken(tokens.accessToken, providerPresets[provider].skipAccessTokenParsing);
  const updatedPersistentSession = {
    exp: accessToken.exp || Math.trunc(Date.now() / 1e3) + Number.parseInt(expiresIn),
    iat: accessToken.iat || Math.trunc(Date.now() / 1e3),
    accessToken: await encryptToken(tokens.accessToken, tokenKey),
    refreshToken: await encryptToken(tokens.refreshToken, tokenKey),
    idToken: tokens?.idToken ? await encryptToken(tokens.idToken, tokenKey) : void 0
  };
  console.log("accessToken expiration", updatedPersistentSession.exp);
  await storageDriver().setItem(session.id, updatedPersistentSession);
  await session.update(defu(user, session.data));
  return true;
}
export async function requireUserSession(event) {
  const logger = useOidcLogger();
  const userSession = await getUserSession(event);
  const config = configMerger(useRuntimeConfig().oidc.providers[userSession.provider], providerPresets[userSession.provider]);
  if (Object.keys(userSession).length === 0) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized"
    });
  }
  const sessionId = await getUserSessionId(event);
  console.log("line 121", sessionId);
  const persistentSession = await storageDriver().getItem(sessionId);
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
      console.log("line 148", expired);
      console.log("line 149", persistentSession?.exp, Math.trunc(Date.now() / 1e3));
    } else {
      console.log("line 174 session not found");
      throw createError({
        statusCode: 401,
        message: "Session not found"
      });
    }
    if (expired) {
      console.log("line 159", expired);
      logger.info("Session expired");
      if (sessionConfig.automaticRefresh) {
        console.log("line 163 automatic refresh", userSession);
        await refreshUserSession(event);
        console.log("line 165 usersession refreshed", userSession);
        return userSession;
      }
      await clearUserSession(event);
      console.log("line 170 user session cleared session expired");
      throw createError({
        statusCode: 401,
        message: "Session expired"
      });
    }
  }
  console.log("line 178", userSession);
  return userSession;
}
export async function getUserSessionId(event) {
  return (await _useSession(event)).id;
}
export async function getAccessToken(event) {
  const session = await _useSession(event);
  if (!session) {
    setTimeout(async () => {
      await requireUserSession(event);
      const sessionId = await getUserSessionId(event);
      console.log("set timeout");
      const persistentSession = await storageDriver().getItem(sessionId);
      const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
      return persistentSession ? await decryptToken(persistentSession.accessToken, tokenKey) : null;
    }, 1e3);
  } else {
    const persistentSession = await storageDriver().getItem(session?.id);
    const tokenKey = process.env.NUXT_OIDC_TOKEN_KEY;
    await refreshUserSession(event);
    return persistentSession ? await decryptToken(persistentSession.accessToken, tokenKey) : null;
  }
}
let sessionConfig;
function _useSession(event) {
  if (!sessionConfig) {
    sessionConfig = defu({ password: process.env.NUXT_OIDC_SESSION_SECRET, name: sessionName }, useRuntimeConfig(event).oidc.session);
  }
  return useSession(event, sessionConfig);
}
