import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

let cachedNames: Set<string> | undefined;

const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((name) => typeof name === 'string');

/** Returns whether a name appears in the host app's killswitch dynamic config. */
export function killswitch(name: string): boolean {
	if (!cachedNames) {
		// Do not permanently cache the default before the host initializes the SDK.
		if (!FeatureGates.initializeCompleted()) {
			return false;
		}

		// Killswitches are operational controls and must not fire experiment exposures.
		// eslint-disable-next-line @atlaskit/platform/use-recommended-utils -- shared dynamic config killswitch helper
		const config = FeatureGates.getExperimentValue<string[]>('killswitch', 'value', [], {
			fireExperimentExposure: false,
			typeGuard: isStringArray,
		});
		// SDK mocks and config overrides can bypass the SDK's type guard.
		cachedNames = new Set(isStringArray(config) ? config.map((entry) => entry.toLowerCase()) : []);
	}

	return cachedNames.has(name.toLowerCase());
}
