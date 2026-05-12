export type CacheEntry<T> = {
  data: T
  timestamp: number
  ttl: number // in milliseconds
}

const cache = new Map<string, CacheEntry<any>>()

/**
 * Get value from in-memory cache
 * @param key Cache key
 * @returns Cached value or null if expired/not found
 */
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

/**
 * Set value in in-memory cache
 * @param key Cache key
 * @param data Data to cache
 * @param ttl Time to live in milliseconds (default: 5 minutes)
 */
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

/**
 * Clear specific cache entry
 */
export function clearCacheEntry(key: string): void {
  cache.delete(key)
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  cache.clear()
}

/**
 * Helper to cache async operations
 */
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
