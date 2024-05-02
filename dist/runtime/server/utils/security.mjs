import { subtle, getRandomValues } from "uncrypto";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { useOidcLogger } from "./oidc.mjs";
const unreservedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
async function encryptMessage(text, key, iv) {
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    encoded
  );
  return genBase64FromBytes(new Uint8Array(ciphertext));
}
async function decryptMessage(text, key, iv) {
  const decoded = genBytesFromBase64(text);
  return await subtle.decrypt({ name: "AES-GCM", iv }, key, decoded);
}
export function generatePkceVerifier(length = 64) {
  if (length < 43 || length > 128) {
    throw new Error("Length must be between 43 and 128");
  }
  const randomValues = getRandomValues(new Uint8Array(length));
  let pkceVerifier = "";
  for (let i = 0; i < randomValues.length; i++) {
    pkceVerifier += unreservedCharacters[randomValues[i] % unreservedCharacters.length];
  }
  return pkceVerifier;
}
export async function generatePkceCodeChallenge(pkceVerifier) {
  const challengeBuffer = await subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(pkceVerifier));
  return genBase64FromBytes(new Uint8Array(challengeBuffer), true);
}
export function generateRandomUrlSafeString(length = 48) {
  const randomBytes = new Uint8Array(length);
  getRandomValues(randomBytes);
  return genBase64FromString(String.fromCharCode(...randomBytes), { encoding: "url" }).slice(0, length);
}
export async function encryptToken(token, key) {
  const secretKey = await subtle.importKey("raw", Buffer.from(key, "base64"), {
    name: "AES-GCM",
    length: 256
  }, true, ["encrypt", "decrypt"]);
  const iv = getRandomValues(new Uint8Array(12));
  const encryptedToken = await encryptMessage(token, secretKey, iv);
  return {
    encryptedToken,
    iv: genBase64FromBytes(iv)
  };
}
export async function decryptToken(input, key) {
  const { encryptedToken, iv } = input;
  const secretKey = await subtle.importKey("raw", Buffer.from(key, "base64"), {
    name: "AES-GCM",
    length: 256
  }, true, ["encrypt", "decrypt"]);
  const decrypted = await decryptMessage(encryptedToken, secretKey, genBytesFromBase64(iv));
  return new TextDecoder().decode(decrypted);
}
export function parseJwtToken(token, skipParsing) {
  if (skipParsing) {
    const logger = useOidcLogger();
    logger.warn("Skipping JWT token parsing");
    return {};
  }
  const [header, payload, signature, ...rest] = token.split(".");
  if (!header || !payload || !signature || rest.length)
    throw new Error("Invalid JWT token");
  return JSON.parse(genStringFromBase64(payload, { encoding: "url" }));
}
export async function validateToken(token, options) {
  const jwks = createRemoteJWKSet(new URL(options.jwksUri));
  const { payload } = await jwtVerify(token, jwks, {
    issuer: options.issuer,
    audience: options.audience
  });
  return payload;
}
export function genBytesFromBase64(input) {
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
export function genBase64FromBytes(input, urlSafe) {
  if (urlSafe) {
    return globalThis.btoa(String.fromCodePoint(...input)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
export function genBase64FromString(input, options = {}) {
  if (options.encoding === "utf8") {
    return genBase64FromBytes(new TextEncoder().encode(input));
  }
  if (options.encoding === "url") {
    return genBase64FromBytes(new TextEncoder().encode(input)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return globalThis.btoa(input);
}
export function genStringFromBase64(input, options = {}) {
  if (options.encoding === "utf8") {
    return new TextDecoder().decode(genBytesFromBase64(input));
  }
  if (options.encoding === "url") {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    const paddingLength = input.length % 4;
    if (paddingLength === 2) {
      input += "==";
    } else if (paddingLength === 3) {
      input += "=";
    }
    return new TextDecoder().decode(genBytesFromBase64(input));
  }
  return globalThis.atob(input);
}
