/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export interface PanelContainerProps {
	/**
	 * The content of the panel container.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

const styles = cssMap({
	wrapper: {
		borderColor: token('color.border'),
		borderInlineStartStyle: 'solid',
		borderInlineWidth: token('border.width'),
		height: '100%',
		backgroundColor: token('elevation.surface'),
		display: 'flex',
		flexDirection: 'column',
	},
});

/**
 * The PanelContainer component provides a standardized container for displaying content
 * in a side panel layout. It follows the design system patterns and integrates
 * with the navigation system for consistent styling and behavior.
 */
export function PanelContainer({ children, testId }: PanelContainerProps) {
	return (
		<Box as="section" role="complementary" testId={testId} xcss={styles.wrapper}>
			{children}
		</Box>
	);
}
