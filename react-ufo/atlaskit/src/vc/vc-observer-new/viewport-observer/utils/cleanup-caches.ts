import { cacheCleanupState } from './cache-cleanup-state';

export function cleanupCaches(
	resultCache: WeakMap<HTMLElement, boolean>,
): WeakMap<HTMLElement, boolean> {
	resultCache = new WeakMap<HTMLElement, boolean>();
	cacheCleanupState.callCount = 0;

	return resultCache;
}
