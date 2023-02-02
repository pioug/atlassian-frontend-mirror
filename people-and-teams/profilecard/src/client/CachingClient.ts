import { LRUMap } from 'lru_map';

interface CachedData<T> {
  expire: number;
  profile: T;
}

export interface CacheConfig {
  cacheSize?: number;
  cacheMaxAge?: number;
}

export default class CachingClient<T> {
  config: Required<CacheConfig>;
  cache: LRUMap<string, CachedData<T>> | null;

  constructor(config: CacheConfig) {
    const defaults = {
      cacheSize: 10,
      cacheMaxAge: 0,
    };

    this.config = { ...defaults, ...config };
    // never set cacheSize or cacheMaxAge to negative numbers
    this.config.cacheSize = Math.max(this.config.cacheSize || 0, 0);
    this.config.cacheMaxAge = Math.max(this.config.cacheMaxAge || 0, 0);
    // DIR-474: cap cache at 30 days.
    if (this.config.cacheMaxAge) {
      this.config.cacheMaxAge = Math.min(
        this.config.cacheMaxAge,
        30 * 24 * 60 * 60 * 1000,
      );
    }
    // Only set cache if maxCacheAge and cacheSize are set
    this.cache =
      !this.config.cacheMaxAge || !this.config.cacheSize
        ? null
        : new LRUMap(this.config.cacheSize);
  }

  setCachedProfile(cacheIdentifier: string, profile: T): void {
    this.cache &&
      this.cache.set(cacheIdentifier, {
        expire: Date.now() + this.config.cacheMaxAge,
        profile,
      });
  }

  getCachedProfile(cacheIdentifier: string): T | null {
    if (!this.cache) {
      return null;
    }

    const cached = this.cache.get(cacheIdentifier);

    if (!cached) {
      return null;
    }

    if (cached.expire < Date.now()) {
      this.cache.delete(cacheIdentifier);
      return null;
    }

    // Extend expiry "date"
    this.setCachedProfile(cacheIdentifier, cached.profile);

    return cached.profile;
  }

  flushCache() {
    if (this.cache) {
      this.cache.clear();
    }
  }
}
