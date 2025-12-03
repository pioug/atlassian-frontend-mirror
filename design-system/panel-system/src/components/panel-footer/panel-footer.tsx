/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Flex } from '@atlaskit/primitives/compiled';
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
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		borderBlockStartStyle: 'solid',
		borderBlockStartWidth: token('border.width'),
		borderColor: token('color.border'),
		backgroundColor: token('color.background.neutral.subtle'),
		height: '56px',
		display: 'flex',
		alignItems: 'center',
	},
	footerContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row-reverse',
		width: '100%',
	},
});

/**
 * The PanelFooter component provides a footer area for panels
 * with consistent styling and spacing matching the header specifications.
 * It automatically organizes content with space-between row-reverse layout, with actions
 * starting from the right-hand side.
 */
export function PanelFooter({ children, testId }: PanelFooterProps): React.JSX.Element {
	return (
		<Box as="footer" testId={testId} xcss={styles.footer}>
			<Flex xcss={styles.footerContent}>{children}</Flex>
		</Box>
	);
}
