/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactElement } from 'react';

// Compiled preserves the existing 0.5 restricted-row opacity, which @atlaskit/css does not support.
import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

// 6px vertical padding around a 20px title, 2px gap, and 16px subtext.
export const PICKER_ITEM_HEIGHT = 50;

const styles = cssMap({
	row: {
		display: 'flex',
		alignItems: 'center',
		boxSizing: 'border-box',
		flexWrap: 'wrap',
		height: '100%',
		width: '100%',
		overflow: 'hidden',
		paddingTop: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
		font: token('font.body'),
	},
	avatar: {
		display: 'flex',
		flexShrink: 0,
	},
	text: {
		display: 'flex',
		flexDirection: 'column',
		rowGap: token('space.025'),
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
		minWidth: 0,
		marginLeft: token('space.150'),
	},
	label: {
		display: 'block',
		color: token('color.text'),
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	subtext: {
		color: token('color.text.subtle'),
		font: token('font.body.small'),
	},
	muted: {
		opacity: 0.5,
	},
});

export interface PickerItemContentProps {
	/** Trailing indicators, kept outside the text column. */
	after?: ReactElement;
	/** Avatar, emoji, or loading image. */
	avatar: ReactElement;
	/** De-emphasize the image and text without disabling interaction. */
	isMuted?: boolean;
	/** Optional secondary text or highlights. Absent content reserves no space. */
	subtext?: string | ReactElement | null;
	/** Primary text, rendered search highlights, or loading content. */
	title: string | ReactElement | null;
}

/** Presentational picker row. Its parent owns selection, focus, and pointer handling. */
export const PickerItemContent = ({
	avatar,
	title,
	subtext,
	after,
	isMuted = false,
}: PickerItemContentProps): React.JSX.Element => (
	<div css={styles.row}>
		<div css={[styles.avatar, isMuted && styles.muted]}>{avatar}</div>
		<div css={[styles.text, isMuted && styles.muted]}>
			{typeof title === 'string' ? title && <div css={styles.label}>{title}</div> : title}
			{subtext && <span css={[styles.label, styles.subtext]}>{subtext}</span>}
		</div>
		{after}
	</div>
);
