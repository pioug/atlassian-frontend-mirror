import type { FeatureFlags, FeatureFlagKey } from '../../types/feature-flags';

/**
 * Transforms FeatureFlags to a type safe string array of the enabled feature flags.
 *
 * Useful for analytics and analysis purposes.
 */
export function getEnabledFeatureFlagKeys(featureFlags: FeatureFlags) {
  return (Object.keys(featureFlags) as FeatureFlagKey[]).filter(
    (key) => featureFlags[key] === true,
  );
}
