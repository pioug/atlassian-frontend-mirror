import FeatureGates from '@atlaskit/feature-gate-js-client';

/**
 * Returns true if the React Compiler runtime is active for platform packages.
 *
 * Controlled by the 'confluence_enable_react-compiler-runtime-platform' experiment in Switcheroo.
 */
export function isReactCompilerActivePlatform(): boolean {
	if (
		FeatureGates.getExperimentValue(
			'confluence_enable_react-compiler-runtime-platform',
			'isEnabled',
			false,
		)
	) {
		return true;
	}
	return false;
}
