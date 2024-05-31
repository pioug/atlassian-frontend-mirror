import { css } from '@emotion/react';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N400, N60A, P400 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const buttonContent = css({
	display: 'flex',
	height: '24px',
	lineHeight: '24px',
	minWidth: '70px',
});

export const wrapper = css({
	display: 'flex',
	marginRight: 0,
});

export const confirmationPopup = css({
	background: token('elevation.surface.overlay', '#fff'),
	borderRadius: `${borderRadius()}px`,
	boxShadow: token('elevation.shadow.overlay', `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`),
	display: 'flex',
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflow: 'auto',
	maxHeight: 'none',
	height: '410px',
	width: '280px',
});

export const confirmationText = css({
	fontSize: relativeFontSizeToBase16(14),
	wordSpacing: '4px',
	lineHeight: '22px',
	color: token('color.text.subtle', N400),
	marginTop: token('space.400', '32px'),
	padding: token('space.250', '20px'),
	'& > div': {
		width: '240px',
	},
	'& > div:first-of-type': {
		marginBottom: token('space.150', '12px'),
	},
	'& > div:nth-of-type(2)': {
		marginBottom: token('space.250', '20px'),
	},
});

export const confirmationHeader = css({
	backgroundColor: token('color.background.discovery.bold', P400),
	height: '100px',
	width: '100%',
	display: 'inline-block',
});

export const confirmationImg = css({
	width: '100px',
	display: 'block',
	margin: `${token('space.250', '24px')} auto 0 auto`,
});
