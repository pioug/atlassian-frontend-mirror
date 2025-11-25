/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Flex } from '@atlaskit/primitives/compiled';
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
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		borderBlockEndStyle: 'solid',
		borderBlockEndWidth: token('border.width'),
		borderColor: token('color.border'),
		height: '56px',
		display: 'flex',
		alignItems: 'center',
	},
	headerContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		gap: token('space.100'),
	},
});

/**
 * The PanelHeader component provides a standardized header area for panels
 * containing the title, actions, and other header-specific content.
 * It automatically organizes content into left (back button + title) and right (actions) sections
 * using flexbox layout. Place PanelActionGroup as the last child to position it on the right.
 */
export function PanelHeader({ children, testId }: PanelHeaderProps) {
	return (
		<Box as="header" testId={testId} xcss={styles.header}>
			<Flex xcss={styles.headerContent}>{children}</Flex>
		</Box>
	);
}
