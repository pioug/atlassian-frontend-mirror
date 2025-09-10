/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export interface PanelHeaderProps {
	/**
	 * The content of the panel header.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

const styles = cssMap({
	header: {
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		borderBlockEndStyle: 'solid',
		borderBlockEndWidth: token('border.width'),
		borderColor: token('color.border'),
		height: '56px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});

/**
 * The PanelHeader component provides a standardized header area for panels
 * containing the title, actions, and other header-specific content.
 */
export function PanelHeader({ children, testId }: PanelHeaderProps) {
	return (
		<Box as="header" testId={testId} xcss={styles.header}>
			{children}
		</Box>
	);
}
