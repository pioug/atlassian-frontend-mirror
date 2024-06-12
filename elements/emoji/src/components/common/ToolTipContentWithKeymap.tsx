/** @jsx jsx */
import React, { Fragment } from 'react';
import { jsx } from '@emotion/react';
import { formatShortcut, type Keymap } from '../../util/keymaps';
import { tooltipShortcutStyle } from './styles';

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
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				{shortcut && <span css={tooltipShortcutStyle}>{shortcut}</span>}
			</Fragment>
		) : null;
	},
);
