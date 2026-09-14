import { cache } from './getMeta';

/**
 * Test-only: clear the cache so each test starts with a clean slate.
 */
export const __clearMetaCacheForTests = (): void => {
	cache.clear();
};
