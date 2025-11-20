import React from 'react';

/**
 * This function is used to switch between two components based on a feature flag
 * @param ComponentOld
 * @param ComponentNext
 * @param featureFlagFn function that returns a boolean value to switch to the next component, e.g. () => fg('my_flag_name')
 * @returns
 */
export const withFeatureFlaggedComponent = <P extends object>(
	ComponentOld: React.ComponentType<P>,
	ComponentNext: React.ComponentType<P>,
	featureFlagFn: () => boolean,
) => {
	return (props: P): React.JSX.Element => {
		// copied from packages/editor/editor-common/src/utils/withFeatureFlaggedComponent.tsx
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading
		return featureFlagFn() ? <ComponentNext {...props} /> : <ComponentOld {...props} />;
	};
};
