import React from 'react';

/**
 * __Global Style Simulator__
 *
 * Sets global styles to replicate existing styles in apps like Jira and Confluence, that our
 * primitives need to have a higher style specificity to override.
 */
export function GlobalStyleSimulator() {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- This is only for testing purposes
		<style>
			{`
				a:focus, button:focus {
					outline: 2px solid red;
				}
			`}
		</style>
	);
}
