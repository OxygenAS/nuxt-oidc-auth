import { createStorage } from "unstorage";
import lruCacheDriver from "unstorage/drivers/lru-cache";
const storage = createStorage();
storage.mount("/oidc", lruCacheDriver({ maxSize: 1e3 }));
export function storageDriver() {
  return storage;
}
