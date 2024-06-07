import { css } from '@emotion/react';

import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const clearTextButtonStyles = css({
	padding: 0,
	marginRight: token('space.050', '4px'),
	color: token('color.icon.subtle', N500),
	background: 'transparent',
	border: 'none',
	cursor: 'pointer',
});

/**
 * Overidding text input margin top which design system provides as a default spacer
 * but it gets in the way of our layout
 */
export const fieldStyles = css({
	'> div': {
		marginTop: 0,
	},
	'& + &': {
		marginTop: token('space.200', '16px'),
	},
});
