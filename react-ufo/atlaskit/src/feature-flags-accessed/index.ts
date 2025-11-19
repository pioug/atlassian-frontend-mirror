import type { FeatureFlagValue } from './common/types';
import { redactValue } from './common/utils';

export { redactValue } from './common/utils';
export type { FeatureFlagValue } from './common/types';

declare global {
	var __CRITERION__: {
		addFeatureFlagAccessed?: (flagName: string, flagValue: FeatureFlagValue) => void;
	};
}

export const allFeatureFlagsAccessed: Map<string, FeatureFlagValue> = new Map();

export const currentFeatureFlagsAccessed: Map<string, FeatureFlagValue> = new Map();

/**
 * Used for tracking accessed feature flags in "@atlassian/jira-feature-flagging".
 * */
export function addFeatureFlagAccessed(
	featureFlagName: string,
	featureFlagValue: FeatureFlagValue,
): void {
	try {
		// Inform Criterion about FF being accessed
		if (
			globalThis.__CRITERION__ &&
			typeof globalThis.__CRITERION__.addFeatureFlagAccessed === 'function'
		) {
			globalThis.__CRITERION__.addFeatureFlagAccessed(featureFlagName, featureFlagValue);
		}
	} catch (_e) {
		// ignore the criterion error
	}

	const value = redactValue(featureFlagValue);
	allFeatureFlagsAccessed.set(featureFlagName, value);
	currentFeatureFlagsAccessed.set(featureFlagName, value);
}
