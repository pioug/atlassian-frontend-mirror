/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type MouseEvent, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Pressable } from '@atlaskit/primitives/compiled';
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
	/**
	 * Callback fired when the resize rail is clicked or dragged.
	 */
	onResize?: (event: MouseEvent<HTMLDivElement>) => void;
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
		position: 'relative',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		flex: '1 1 0%',
		minHeight: '0px',
		overflow: 'hidden',
	},
	resizeRail: {
		position: 'absolute',
		insetBlockStart: 0,
		insetInlineStart: 0,
		width: '4px',
		paddingInline: token('space.025'),
		height: '100%',
		backgroundColor: 'transparent',
		cursor: 'col-resize',
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			cursor: 'col-resize',
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			cursor: 'col-resize',
		},
	},
});

/**
 * The PanelContainer component provides a standardized container for displaying content
 * in a side panel layout. It follows the design system patterns and integrates
 * with the navigation system for consistent styling and behavior.
 */
export function PanelContainer({ children, testId, onResize }: PanelContainerProps) {
	const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (onResize) {
			onResize(event as any);
		}
	};

	return (
		<Box as="section" role="complementary" testId={testId} xcss={styles.wrapper}>
			{onResize && (
				<Pressable
					xcss={styles.resizeRail}
					onMouseDown={handleMouseDown}
					aria-label="Resize panel"
				/>
			)}
			<Box xcss={styles.content}>{children}</Box>
		</Box>
	);
}
