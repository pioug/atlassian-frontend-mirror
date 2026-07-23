import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
import { addFeatureFlagAccessed } from '@atlaskit/react-ufo/feature-flags-accessed';

import { devOverrides } from './dev-overrides-store';
import type { AssurePrimitives } from './types';

export function expValInternal<T>(
	experimentName: string,
	param: string,
	defaultValue: T,
	fireExperimentExposure: boolean,
): AssurePrimitives<T> {
	// Dev-mode override (platform website dev panel, Gemini VR test harness).
	if (devOverrides.has(experimentName)) {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		const overrideParams = devOverrides.get(experimentName) as Record<string, T>;
		const overrideValue = overrideParams[param];
		if (overrideValue !== undefined) {
			addFeatureFlagAccessed(`${experimentName}:${param}`, overrideValue as never);
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			return overrideValue as AssurePrimitives<T>;
		}
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return defaultValue as AssurePrimitives<T>;
	}

	// If Statsig is not initialized, return the default.
	if (!FeatureGates.initializeCompleted()) {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return defaultValue as AssurePrimitives<T>;
	}

	// Live Statsig value.
	// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
	const value = FeatureGates.getExperimentValue(experimentName, param, defaultValue, {
		fireExperimentExposure,
	});

	addFeatureFlagAccessed(`${experimentName}:${param}`, value as never);

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	return value as AssurePrimitives<T>;
}
