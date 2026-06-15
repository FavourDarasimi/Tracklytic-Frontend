const cache = new Map();

const DEFAULT_TTL = 5 * 60 * 1000;

export const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

export const setCache = (key, data, ttl = DEFAULT_TTL) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

export const invalidateCache = (key) => {
  cache.delete(key);
};

export const invalidateCacheByPrefix = (prefix) => {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
};
