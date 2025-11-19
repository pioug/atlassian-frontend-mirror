import FeatureGates from '@atlaskit/feature-gate-js-client';

import { addFeatureFlagAccessed } from '../feature-flags-accessed';

// copied from '@atlaskit/tmp-editor-statsig/expVal' to avoid circular dependency
export const expVal = (
	experimentName: string,
	experimentParam: string,
	defaultValue: boolean,
): boolean => {
	// If client is not initialized, we return the default value
	if (!FeatureGates.initializeCompleted()) {
		return defaultValue;
	}

	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const experimentValue = FeatureGates.getExperimentValue(
		experimentName,
		experimentParam,
		defaultValue,
	);

	addFeatureFlagAccessed(`${experimentName}:${experimentParam}`, experimentValue as never);

	return experimentValue;
};
