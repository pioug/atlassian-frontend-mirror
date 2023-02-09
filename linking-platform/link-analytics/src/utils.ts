import { createHash } from 'rusha';
import { LRUMap } from 'lru_map';

const URL_HASH_CACHE_SIZE = 100;

export const sha1Hash = (str: string): string =>
  createHash().update(str).digest('hex');

const urlCache = new LRUMap<string, string>(URL_HASH_CACHE_SIZE);

export const getUrlHash = (url: string) => {
  if (!urlCache.has(url)) {
    urlCache.set(url, sha1Hash(url));
  }
  return urlCache.get(url);
};
