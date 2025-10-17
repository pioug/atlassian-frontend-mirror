import React from 'react';

/**
 * __Global Style Simulator__
 *
 * Sets global styles to replicate existing styles in apps like Jira and Confluence, that our
 * components need to have a higher style specificity to override.
 */
export function GlobalStyleSimulator(): JSX.Element {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- This is only for testing purposes
		<style>
			{`
				kbd {
					background-color: red;
					border: 3px solid green;
					-moz-border-radius: 5px;
					-webkit-border-radius: 5px;
					border-radius: 5px;
					-moz-box-shadow: 0 1px 0 green, 0 0 0 2px brown inset;
					-webkit-box-shadow: 0 1px 0 green, 0 0 0 2px brown inset;
					box-shadow: 0 1px 0 green, 0 0 0 2px brown inset;
					color: teal;
					display: inline-block;
					font-family: sans-serif;
					font-size: 18px;
					line-height: 20px;
					margin: 0 0.1em;
					min-width: 2em;
					padding: 0.1em 0.6em;
					text-align: center;
					text-shadow: 0 1px 0 brown;
					vertical-align: bottom;
				}

				.atlaskit-portal kbd {
					background-color: blue;
				}
			`}
		</style>
	);
}
