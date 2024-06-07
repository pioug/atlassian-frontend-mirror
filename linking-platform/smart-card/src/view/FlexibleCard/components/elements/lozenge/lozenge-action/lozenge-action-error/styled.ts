import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N800 } from '@atlaskit/theme/colors';
import { getTruncateStyles } from '../../../../utils';

export const dropdownItemGroupStyles = css({
	button: {
		width: '220px',
		'&:hover': {
			backgroundColor: 'inherit',
			cursor: 'default',
		},
	},
});

const sharedBlockStyles = css({
	display: 'flex',
	gap: token('space.100', '0.5rem'),
	lineHeight: '1rem',
	minWidth: 0,
	overflow: 'hidden',
	flexDirection: 'row',
	alignItems: 'center',
});

export const contentStyles = css(sharedBlockStyles, {
	marginTop: token('space.025', '2px'),
	alignItems: 'flex-start',
	'> span, > div': {
		fontSize: '0.875rem',
		lineHeight: '1.25rem',
		color: token('color.text', N800),
	},
});

export const linkStyles = css(sharedBlockStyles, {
	cursor: 'pointer',
	fontSize: '0.875rem',
	marginTop: token('space.100', '8px'),
	marginLeft: token('space.400', '32px'),
	marginBottom: token('space.025', '2px'),
});

export const textStyles = (maxLines: number) =>
	css(
		{
			lineHeight: '1rem',
			whiteSpace: 'normal',
		},
		getTruncateStyles(maxLines),
	);
