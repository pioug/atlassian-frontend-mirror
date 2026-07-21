import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

const BOOLEAN_CONFIG_KEY = 'value';

/**
 * Reads a boolean flag (stored under the `value` key) from a Statsig dynamic
 * config, returning `defaultValue` when the client is not ready, the config is
 * missing, or the value is not a boolean.
 *
 * Use this for a dynamic-config-backed kill switch, e.g.
 * `dynamicConfigBooleanValue('platform_editor_ai_remix_safety_violation')`.
 */
export function dynamicConfigBooleanValue(configName: string, defaultValue = false): boolean {
	if (!FeatureGates.initializeCompleted()) {
		return defaultValue;
	}

	try {
		// Dynamic configs are exposed through the same client surface as experiments.
		// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
		const config = FeatureGates.getExperiment(configName);
		const candidate = (config.value as Record<string, unknown>)[BOOLEAN_CONFIG_KEY];

		if (typeof candidate !== 'boolean') {
			return defaultValue;
		}

		return candidate;
	} catch {
		return defaultValue;
	}
}
