import React from 'react';

/**
 * This function is used to switch between two components based on a feature flag
 * @param ComponentOld
 * @param ComponentNext
 * @param featureFlagFn function that returns a boolean value to switch to the next component, e.g. () => fg('platform_editor_react18_phase2')
 * @returns
 */
export const withFeatureFlaggedComponent = <P extends object>(
	ComponentOld: React.ComponentType<P>,
	ComponentNext: React.ComponentType<P>,
	featureFlagFn: () => boolean,
) => {
	return (props: P) => {
		return featureFlagFn() ? <ComponentNext {...props} /> : <ComponentOld {...props} />;
	};
};
