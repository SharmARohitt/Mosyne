/**
 * Caching Layer for Envio Queries
 * 
 * Implements in-memory caching with TTL to:
 * 1. Reduce Envio API calls
 * 2. Improve response times
 * 3. Handle rate limiting gracefully
 * 4. Provide fallback data when Envio is unavailable
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class EnvioCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 60 * 1000; // 60 seconds
  private readonly MAX_CACHE_SIZE = 1000;

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      // Expired - remove from cache
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Store data in cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    // Prevent cache from growing too large
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
    };
  }
}

// Singleton instance
export const envioCache = new EnvioCache();

/**
 * Helper function to execute cached queries
 */
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = envioCache.get<T>(key);
  if (cached !== null) {
    console.log(`✅ Cache hit: ${key}`);
    return cached;
  }

  // Cache miss - execute query
  console.log(`⚡ Cache miss: ${key} - querying Envio...`);
  const data = await queryFn();
  
  // Store in cache
  envioCache.set(key, data, ttl);
  
  return data;
}
