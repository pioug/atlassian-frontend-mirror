import { css } from '@emotion/react';

import { N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { wrapperDefault } from '../styles';

export const widerLayoutClassName = 'wider-layout';

export const wrapperStyle = css(wrapperDefault, {
	'&.without-frame': {
		background: 'transparent',
	},
	cursor: 'pointer',
	width: '100%',
	'.extension-overflow-wrapper:not(.with-body)': {
		overflowX: 'auto',
	},
	'&.with-border': {
		border: `1px solid transparent`, // adding this so macro doesn't jump when hover border is shown
	},
	'&.with-bodied-border': {
		border: `1px solid ${token('color.border', N30)}`,
	},
	'&.with-hover-border': {
		border: `1px solid ${token('color.border.input', N500)}`,
	},
	'&.with-margin-styles': {
		margin: `0 ${token('space.negative.150', '-12px')}`,
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
		padding: '0 10px', // need exact number here to match editor elements' width
	},
});

export const header = css({
	padding: `${token('space.050', '4px')} ${token('space.050', '4px')} 0px`,
	verticalAlign: 'middle',
	'&.with-children:not(.without-frame)': {
		padding: `${token('space.050', '4px')} ${token('space.100', '8px')} ${token(
			'space.100',
			'8px',
		)}`,
	},
	'&.without-frame': {
		padding: 0,
	},
});

export const content = css({
	padding: token('space.100', '8px'),
	background: token('elevation.surface', 'white'),
	border: `1px solid ${token('color.border', N30)}`,
	borderRadius: token('border.radius', '3px'),
	cursor: 'initial',
	width: '100%',
	'&.remove-border': {
		border: 'none',
	},
});

export const contentWrapper = css({
	padding: `0 ${token('space.100', '8px')} ${token('space.100', '8px')}`,
	display: 'flex',
	justifyContent: 'center',
	'&.with-padding-styles': {
		padding: token('space.100', '8px'),
	},
});

export const overflowWrapperStyles = css({
	'&.with-margin-styles': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		margin: `0 -10px`, // need exact number here to match editor elements' width
	},
});
