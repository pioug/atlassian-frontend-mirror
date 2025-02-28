import React from 'react';

/**
 * __Global Style Simulator__
 *
 * Sets global styles to replicate existing styles
 * in products like Jira and Confluence, that Link Button
 * needs to have a higher style specificity to override.
 */
const GlobalStyleSimulator = () => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- This is only for testing purposes
		<style>
			{`
				a, a:visited, a:hover, a:active, a:focus {
					color: red;
					text-decoration: line-through;
				}
			`}
		</style>
	);
};

export default GlobalStyleSimulator;
