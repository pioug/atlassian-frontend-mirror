/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import type { FeatureFlagValue } from './common/types';
import { redactValue } from './common/utils/redactValue';

/**
 * @deprecated Use `import { redactValue } from '@atlaskit/react-ufo/redact-value'` instead.
 */
export { redactValue } from './common/utils/redactValue';
export type { FeatureFlagValue } from './common/types';

declare global {
	var __CRITERION__: {
		addFeatureFlagAccessed?: (flagName: string, flagValue: FeatureFlagValue) => void;
	};
}

export const allFeatureFlagsAccessed: Map<string, FeatureFlagValue> = new Map();

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const currentFeatureFlagsAccessed: Map<string, FeatureFlagValue> = new Map();

/**
 * Used for tracking accessed feature flags in "@atlassian/jira-feature-flagging".
 * */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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
