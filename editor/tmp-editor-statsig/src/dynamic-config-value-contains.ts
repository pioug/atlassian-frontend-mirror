import FeatureGates from '@atlaskit/feature-gate-js-client';

function isStringList(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

const STRING_LIST_CONFIG_KEY = 'value';

/**
 * Returns whether a Statsig dynamic config's string list (under the `value` key) includes `token`
 * (exact match).
 *
 * Used for UX tokens such as `remove-rovo-placeholder` inside `platform_editor_ai_autocomplete_ux_config`.
 */
export function dynamicConfigStringListIncludes(configName: string, token: string): boolean {
	if (!FeatureGates.initializeCompleted()) {
		return false;
	}

	try {
		// Dynamic configs are exposed through the same client surface as experiments.
		// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
		const config = FeatureGates.getExperiment(configName);
		const listCandidate = (config.value as Record<string, unknown>)[STRING_LIST_CONFIG_KEY];

		if (!isStringList(listCandidate)) {
			return false;
		}

		return listCandidate.includes(token);
	} catch {
		return false;
	}
}
