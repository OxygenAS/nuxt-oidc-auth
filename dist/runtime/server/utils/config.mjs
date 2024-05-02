import { withoutTrailingSlash, cleanDoubleSlashes, withHttps, joinURL, parseURL } from "ufo";
export function validateConfig(config, requiredProps) {
  const missingProperties = [];
  let valid = true;
  for (const prop of requiredProps) {
    if (!(prop in config)) {
      valid = false;
      missingProperties.push(prop.toString());
    }
  }
  return { valid, missingProperties, config };
}
export function generateProviderUrl(baseUrl, relativeUrl) {
  const parsedUrl = parseURL(baseUrl);
  return parsedUrl.protocol ? withoutTrailingSlash(cleanDoubleSlashes(joinURL(baseUrl, "/", relativeUrl || ""))) : withoutTrailingSlash(cleanDoubleSlashes(withHttps(joinURL(baseUrl, "/", relativeUrl || ""))));
}
