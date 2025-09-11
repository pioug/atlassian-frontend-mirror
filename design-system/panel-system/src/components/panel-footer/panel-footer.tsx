import React, { type ReactNode } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export interface PanelFooterProps {
	/**
	 * The content to display in the footer.
	 */
	children?: ReactNode;
	/**
	 * Unique string that appears as a data attribute `data-testid` in the rendered code,
	 * often used for automated tests.
	 */
	testId?: string;
}

const styles = cssMap({
	footer: {
		paddingBlockStart: token('space.200', '16px'),
		paddingInlineEnd: token('space.200', '16px'),
		paddingBlockEnd: token('space.200', '16px'),
		paddingInlineStart: token('space.200', '16px'),
		borderBlockStart: `${token('border.width')} solid ${token('color.border')}`,
		backgroundColor: token('color.background.neutral.subtle'),
	},
});

/**
 * The PanelFooter component provides a footer area for panels
 * with consistent styling and spacing.
 */
export function PanelFooter({ children, testId }: PanelFooterProps) {
	return (
		<Box as="footer" testId={testId} xcss={styles.footer}>
			{children}
		</Box>
	);
}
