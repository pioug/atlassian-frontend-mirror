import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

// The React Compiler calls this once per compiled function, when its module first runs.
let cachedIsActive: boolean | undefined;

// expVal from @atlaskit/platform-feature-experiments would import @atlaskit/react-ufo, which is
// itself compiled with this gating function.
function isExperimentEnabled(experimentName: string): boolean {
	return Boolean(FeatureGates.getExperimentValue(experimentName, 'isEnabled', false));
}

/**
 * Returns true if the React Compiler runtime is active for platform packages.
 *
 * Controlled by the 'confluence_enable_react-compiler-runtime-platform' experiment in Switcheroo.
 * The result is cached for the page load once Statsig has initialised.
 */
export function isReactCompilerActivePlatform(): boolean {
	if (cachedIsActive !== undefined) {
		return cachedIsActive;
	}

	const isActive = isExperimentEnabled('confluence_enable_react-compiler-runtime-platform');

	// Before Statsig initialises, getExperimentValue returns the default, which must not be cached.
	if (FeatureGates.initializeCompleted()) {
		cachedIsActive = isActive;
	}

	return isActive;
}
