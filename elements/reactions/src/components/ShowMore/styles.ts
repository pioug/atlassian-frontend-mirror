/** @jsx jsx */
import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const moreEmojiContainerStyle = css({ display: 'flex' });

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const moreButtonStyle = css({
	opacity: 0,
	outline: 'none',
	backgroundColor: 'transparent',
	border: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
	cursor: 'pointer',
	margin: `${token('space.050', '4px')} ${token('space.050', '4px')} ${token(
		'space.050',
		'4px',
	)} 0`,
	padding: token('space.050', '4px'),
	width: '38px',
	verticalAlign: 'top',

	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30A),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const separatorStyle = css({
	backgroundColor: token('color.border', N30A),
	margin: `${token('space.100', '8px')} ${token('space.100', '8px')} ${token(
		'space.100',
		'8px',
	)} ${token('space.050', '4px')}`,
	width: '1px',
	height: '60%',
	display: 'inline-block',
});
