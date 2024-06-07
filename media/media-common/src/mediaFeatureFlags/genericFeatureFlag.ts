import { getLocalMediaFeatureFlag } from '../mediaFeatureFlag-local';

// Strongly typed method
// Enforces consistency bewteen flagName, defaults & featureFlags parameters
// All keys and value types need to match.
// Examples (Uncomment to see results):
// This works:
//    getGenericFeatureFlag('key1',{ key1: true, key2: 'hiya', key3: 554 },{ key1: false, key2: 'bye', key3: 4 });
//    getGenericFeatureFlag('key1',{ key1: true, key2: 'hiya', key3: 554 },{ key1: false, key3: 4 });
// TS Error: key5 does not exist in default
//    getGenericFeatureFlag('key5',{ key1: true, key2: 'hiya', key3: 554 },{ key1: false, key2: 'bye', key3: 4 });
//    getGenericFeatureFlag('key1',{ key1: true, key2: 'hiya', key3: 554 },{ key1: false, key5: 'bye', key3: 4 });
// TS Error: key2 values are inconsistent
//    getGenericFeatureFlag('key1',{ key1: true, key2: 'hiya', key3: 554 },{ key1: false, key2: true, key3: 4 });

/**
 * Returns the first value for the flagName found in this priority
 *  1: local storage
 *  2: featureFlags parameter
 *  3: defaults parameter
 */
export function getGenericFeatureFlag<T, K extends string, M extends Record<K, any>>(
	flagName: K,
	defaults: M,
	featureFlags?: Partial<M>,
): T {
	const devOverride = getLocalMediaFeatureFlag(flagName);
	if (devOverride !== null) {
		try {
			return JSON.parse(devOverride) as T;
		} catch (e) {}
	}

	if (featureFlags) {
		return (flagName in featureFlags ? featureFlags[flagName] : defaults[flagName]) as unknown as T;
	}
	return defaults[flagName] as unknown as T;
}
