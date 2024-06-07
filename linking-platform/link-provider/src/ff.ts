import { type LinkingPlatformFeatureFlags } from '@atlaskit/linking-common';
import { useSmartLinkContext } from './state/context';

export function useFeatureFlag(featureFlag: keyof LinkingPlatformFeatureFlags) {
	const { featureFlags } = useSmartLinkContext();

	return featureFlags && featureFlags[featureFlag];
}
