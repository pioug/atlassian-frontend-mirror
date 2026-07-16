import { CACHE_MAP_KEY } from './index';

/**
 * Resets the cache used by the conditional hooks factory.
 * This is useful for testing purposes or when you want to clear the cache between runs.
 * You should **never** use this in production code as it will break the rules of hooks.
 * Seriously, don't do it.
 *
 * Calling this function will cause all instances of conditional hooks to be re-evaluated
 * and may lead to unexpected behaviour if the conditions change.
 */
export function DO_NOT_USE_THIS_IN_PRODUCTION_EVER_resetConditionalHooksFactoryCache(): void {
	globalThis[CACHE_MAP_KEY] = new WeakMap();
}
