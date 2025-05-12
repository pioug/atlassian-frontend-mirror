import { type LinkingPlatformFeatureFlags } from '@atlaskit/linking-common';
import { useSmartLinkContext } from './state/context';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-30338 Internal documentation for deprecation (no external access)}
 * Remove any usages of this function. It is dead code
 */
export function useFeatureFlag(featureFlag: keyof LinkingPlatformFeatureFlags) {
	const context = useSmartLinkContext();

	return context?.featureFlags && context?.featureFlags?.[featureFlag];
}
