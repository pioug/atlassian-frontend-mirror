import { cache } from './cache';

/**
 * Test-only: clear the cached units rollout settings so each test starts with a clean slate.
 */
export const __clearUnitsRolloutSettingsCacheForTests = (): void => {
	cache.promise = undefined;
};
