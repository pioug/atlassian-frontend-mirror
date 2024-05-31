import { css } from '@emotion/react';

import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../styles';

export const wrapperStyle = css(wrapperDefault, {
	cursor: 'pointer',
	display: 'inline-flex',
	margin: `1px 1px ${token('space.050', '4px')}`,
	'> img': {
		borderRadius: token('border.radius', '3px'),
	},
	'&::after, &::before': {
		verticalAlign: 'text-top',
		display: 'inline-block',
		width: '1px',
		content: "''",
	},
	'&.with-children': {
		padding: 0,
		background: token('color.background.neutral.subtle', 'white'),
	},
	'&.with-border': {
		border: `1px solid transparent`, // adding this so macro doesn't jump when hover border is shown
	},
	'&.with-hover-border': {
		border: `1px solid ${token('color.border.input', N500)}`,
	},
});

export const inlineWrapperStyles = css({
	maxWidth: '100%',
	'tr &': {
		maxWidth: 'inherit',
	},
	'.rich-media-item': {
		maxWidth: '100%',
	},
});
