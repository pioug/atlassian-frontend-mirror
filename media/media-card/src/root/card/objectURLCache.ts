import { LRUCache, Entry } from 'lru-fast';

export const PREVIEW_CACHE_LRU_SIZE = 20;

class ExtendedLRUCache extends LRUCache<string, string> {
  shift(): Entry<string, string> | undefined {
    const entry = super.shift();
    if (entry) {
      URL.revokeObjectURL(entry.value);
    }
    return entry;
  }
}

export class ObjectURLCache {
  private cache: LRUCache<string, string>;

  constructor(size: number) {
    this.cache = new ExtendedLRUCache(size);
  }

  has(key: string) {
    return !!this.cache.get(key);
  }

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: string) {
    this.cache.set(key, value);
  }

  reset() {
    this.cache.removeAll();
  }
}

export const objectURLCache = new ObjectURLCache(PREVIEW_CACHE_LRU_SIZE);
