import type { FeatureFlagKey, FeatureFlags } from './types/feature-flags';

/**
 * Transforms FeatureFlags to a type safe string array of the enabled feature flags.
 *
 * Useful for analytics and analysis purposes.
 */
export function getEnabledFeatureFlagKeys(featureFlags: FeatureFlags): (keyof FeatureFlags)[] {
	return (Object.keys(featureFlags) as FeatureFlagKey[]).filter(
		(key) => featureFlags[key] === true,
	);
}
