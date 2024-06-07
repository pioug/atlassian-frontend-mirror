import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

export const nameCellWrapperStyles = css({
	display: 'flex',
	alignContent: 'center',
	alignItems: 'center',
});

export const truncateWrapperStyles = css({
	minWidth: 0,
	width: '100%',
	marginLeft: token('space.050', '4px'),
	'span:first-of-type': {
		'&::first-letter': {
			textTransform: 'capitalize',
		},
	},
});

export const mediaTableWrapperStyles = css({
	tr: {
		cursor: 'pointer',
		'td:empty': {
			padding: 0,
		},
	},
});
