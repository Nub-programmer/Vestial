export type CacheEntry<T> = {
  data: T
  timestamp: number
  ttl: number // ms until this entry expires
}

const cache = new Map<string, CacheEntry<any>>()

// Returns cached data if it's still fresh.
export function getCacheValue<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (!entry) return null

  const now = Date.now()
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key)
    return null
  }

  return entry.data
}

// Stores data with a TTL so old entries naturally drop off.
export function setCacheValue<T>(
  key: string,
  data: T,
  ttl: number = 5 * 60 * 1000
): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  })
}

// Removes one cache key.
export function clearCacheEntry(key: string): void {
  cache.delete(key)
}

// Clears everything in the in-memory cache.
export function clearAllCache(): void {
  cache.clear()
}

// Wraps an async fetcher and caches the result by key.
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = getCacheValue<T>(key)
  if (cached) return cached

  const data = await fetcher()
  setCacheValue(key, data, ttl)
  return data
}
