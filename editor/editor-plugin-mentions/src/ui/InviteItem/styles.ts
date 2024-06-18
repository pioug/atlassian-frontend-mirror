// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { N30, N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const ROW_SIDE_PADDING = 14;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const rowStyle = css({
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	overflow: 'hidden',
	padding: `${token('space.075', '6px')} ${ROW_SIDE_PADDING}px`,
	textOverflow: 'ellipsis',
	verticalAlign: 'middle',
});

export const AVATAR_HEIGHT = 36;
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const avatarStyle = css({
	position: 'relative',
	flex: 'initial',
	opacity: 'inherit',
	width: '36px',
	height: `${AVATAR_HEIGHT}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		width: '24px',
		height: '24px',
		padding: token('space.075', '6px'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const nameSectionStyle = css({
	flex: 1,
	minWidth: 0,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '14px',
	color: token('color.text.subtle', N300),
	opacity: 'inherit',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const mentionItemStyle = css({
	backgroundColor: 'transparent',
	display: 'block',
	overflow: 'hidden',
	listStyleType: 'none',
	cursor: 'pointer',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const mentionItemSelectedStyle = css({
	backgroundColor: token('color.background.neutral.subtle.hovered', N30),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const capitalizedStyle = css({
	textTransform: 'capitalize',
});
