/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export interface PanelActionGroupProps {
	/**
	 * The action components to group together.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

const styles = cssMap({
	group: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.100'),
	},
});

/**
 * The PanelActionGroup component provides a container for grouping
 * panel actions together with consistent spacing and layout.
 */
export function PanelActionGroup({ children, testId }: PanelActionGroupProps) {
	return (
		<Box testId={testId} xcss={styles.group}>
			{children}
		</Box>
	);
}
