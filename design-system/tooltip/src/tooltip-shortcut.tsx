/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const styles = cssMap({
	shortcutSegmentsContainer: {
		display: 'flex',
		gap: token('space.025'),
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.025'),
	},
	shortcutSegment: {
		paddingBlockStart: token('space.025'),
		paddingBlockEnd: token('space.025'),
		paddingInlineStart: token('space.075'),
		paddingInlineEnd: token('space.075'),
		font: token('font.code'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
		borderRadius: token('radius.xsmall'),
	},
});

type TooltipShortcutProps = {
	shortcut: string[];
};

/**
 * __Tooltip shortcut__
 *
 * An internal component that is used to display a keyboard shortcut within a tooltip, showing each key
 * as a styled segment after the main tooltip content.
 */
export const TooltipShortcut = ({ shortcut }: TooltipShortcutProps) => {
	return (
		<div css={styles.shortcutSegmentsContainer}>
			{shortcut.map((segment, index) => (
				<kbd key={`${segment}-${index}`} css={styles.shortcutSegment}>
					{segment}
				</kbd>
			))}
		</div>
	);
};
