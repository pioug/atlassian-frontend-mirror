import { type LinkingPlatformFeatureFlags } from '@atlaskit/linking-common';
import { useSmartLinkContext } from './state/context';

export function useFeatureFlag(featureFlag: keyof LinkingPlatformFeatureFlags) {
	const context = useSmartLinkContext();

	return context?.featureFlags && context?.featureFlags?.[featureFlag];
}
