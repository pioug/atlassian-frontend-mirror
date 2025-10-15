/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export interface PanelTitleProps {
	/**
	 * The title text content.
	 */
	children: ReactNode;
	/**
	 * Optional icon to display alongside the title.
	 */
	icon?: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

const styles = cssMap({
	title: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.100'),
		flexGrow: 1,
	},
	icon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '24px',
		height: '24px',
	},
});

/**
 * The PanelTitle component provides a standardized title display for panels
 * with optional icon support and consistent typography.
 */
export function PanelTitle({ children, icon, testId }: PanelTitleProps) {
	return (
		<Box testId={testId} xcss={styles.title}>
			{icon && <Box xcss={styles.icon}>{icon}</Box>}
			<Heading size="xsmall" as="h2">
				{children}
			</Heading>
		</Box>
	);
}
