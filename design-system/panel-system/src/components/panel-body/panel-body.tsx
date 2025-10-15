/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export interface PanelBodyProps {
	/**
	 * The content of the panel body.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

const styles = cssMap({
	body: {
		flexGrow: 1,
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		overflow: 'auto',
	},
});

/**
 * The PanelBody component provides the main content area for panels
 * with consistent styling and scroll behavior.
 */
export function PanelBody({ children, testId }: PanelBodyProps) {
	return (
		<Box testId={testId} xcss={styles.body}>
			{children}
		</Box>
	);
}
