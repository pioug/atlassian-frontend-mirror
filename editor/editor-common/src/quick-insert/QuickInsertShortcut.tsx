/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	shortcut: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small'),
		color: token('color.text.subtle'),
		flexShrink: 0,
		font: token('font.body.small'),
		paddingBlock: token('space.025'),
		paddingInline: token('space.050'),
		whiteSpace: 'nowrap',
	},
	disabled: {
		backgroundColor: token('color.background.disabled'),
		color: token('color.text.disabled'),
	},
});

/**
 * The keyboard or markdown shortcut chip shown beside a Quick Insert item's title, in both the
 * slash-menu row and the Element Browser tile.
 */
export const QuickInsertShortcut = ({
	isDisabled = false,
	shortcut,
}: {
	isDisabled?: boolean;
	shortcut: string;
}): React.JSX.Element => (
	<span css={[styles.shortcut, isDisabled && styles.disabled]}>{shortcut}</span>
);
