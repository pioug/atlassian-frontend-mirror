/* eslint-disable @atlaskit/design-system/no-html-anchor */
/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */

/* eslint-disable @atlaskit/design-system/no-html-heading */
/* eslint-disable @atlaskit/design-system/use-heading */
/* eslint-disable @atlaskit/design-system/use-primitives-text */
import React from 'react';

import { ThemeProvider } from '@atlaskit/app-provider';
import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const contentStyles = cssMap({
	body: {
		paddingInline: token('space.500'),
		paddingBlock: token('space.500'),
		backgroundColor: token('elevation.surface'),
		maxWidth: '760px',
	},
	section: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		borderRadius: token('radius.xlarge'),
		backgroundColor: token('elevation.surface'),
	},
});

/**
 * This example demonstrates how CSS reset supports sub-tree theming.
 *
 * CSS reset will redeclare token-based styles to ensure that the
 * new CSS variable values are applied.
 *
 * Without this, inherited styles from ancestor elements (like the body)
 * would not be updated when CSS variables change.
 */
export default (): React.JSX.Element => (
	<Box xcss={contentStyles.body}>
		<ThemeProvider defaultColorMode='dark'>
			<Box xcss={contentStyles.section}>
				<h2>Dark theme</h2>
				<p>
					This paragraph is the correct color.
				</p>
				<ul>
					<li>List items in sub-tree theme</li>
					<li>Will have correct colors</li>
				</ul>
				<blockquote>
					This blockquote is also the correct color.
				</blockquote>
				<a href="https://www.atlassian.com">This link will be the correct color</a>
				<ThemeProvider defaultColorMode='light'>
					<Box xcss={contentStyles.section}>
						<h2>Light theme</h2>
						<p>
							This paragraph is the correct color
						</p>
						<ul>
							<li>List items in sub-tree theme</li>
							<li>Will have correct colors</li>
						</ul>
						<blockquote>
							This blockquote is also the correct color.
						</blockquote>
						<a href="https://www.atlassian.com">This link will be the correct color</a>
					</Box>
				</ThemeProvider>
			</Box>
		</ThemeProvider>
	</Box>
);
