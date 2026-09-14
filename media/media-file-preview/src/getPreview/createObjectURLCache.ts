import { PREVIEW_CACHE_LRU_SIZE } from './objectURLCache';
import { ObjectURLCache } from './ObjectURLCache-2';

export const createObjectURLCache = (): ObjectURLCache =>
	new ObjectURLCache(PREVIEW_CACHE_LRU_SIZE);
