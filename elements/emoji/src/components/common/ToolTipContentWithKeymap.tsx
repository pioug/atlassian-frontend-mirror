/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N400 } from '@atlaskit/theme/colors';
import { formatShortcut, type Keymap } from '../../util/keymaps';

const tooltipShortcutStyle = css({
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
	backgroundColor: token('color.background.inverse.subtle', N400),
	paddingTop: 0,
	paddingBottom: 0,
	paddingLeft: token('space.025', '2px'),
	paddingRight: token('space.025', '2px'),
	/* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */
	/* stylelint-disable-next-line */
	label: 'tooltip-shortcut',
});

export const ToolTipContentWithKeymap = React.memo(
	({
		description,
		shortcutOverride,
		keymap,
	}: {
		description?: string | React.ReactNode;
		keymap?: Keymap;
		shortcutOverride?: string;
	}) => {
		const shortcut = shortcutOverride || (keymap && formatShortcut(keymap));
		return shortcut || description ? (
			<Fragment>
				{description}
				{shortcut && description && '\u00A0'}
				{shortcut && <span css={tooltipShortcutStyle}>{shortcut}</span>}
			</Fragment>
		) : null;
	},
);
