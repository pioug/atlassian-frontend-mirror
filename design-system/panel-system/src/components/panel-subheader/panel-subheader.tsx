/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export interface PanelSubheaderProps {
	/**
	 * The content of the panel subheader.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

const styles = cssMap({
	subheader: {
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		borderBlockEndStyle: 'solid',
		borderBlockEndWidth: token('border.width'),
		borderColor: token('color.border'),
	},
});

/**
 * The PanelSubheader component provides a slot for subheaders.
 */
export function PanelSubheader({ children, testId }: PanelSubheaderProps) {
	return (
		<Box testId={testId} xcss={styles.subheader}>
			{children}
		</Box>
	);
}
