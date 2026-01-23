/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

// Pushing our example off the corner of the screen
const outersStyles = cssMap({
	root: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

const containerStyles = cssMap({
	root: {
		width: '320px', // default width of the sidebar
		backgroundColor: token('elevation.surface'),
		borderColor: token('color.border'),
		borderWidth: token('border.width'),
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
	},
});

export function SidebarExampleContainer({ children }: { children: ReactNode }) {
	return (
		<div css={outersStyles.root}>
			<div css={containerStyles.root}>{children}</div>
		</div>
	);
}
