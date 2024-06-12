import { css } from '@emotion/react';

import { N20, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const dropdownItem = css({
	display: 'flex',
	alignItems: 'center',
	cursor: 'pointer',
	textDecoration: 'none',
	padding: `${token('space.100', '8px')} ${token('space.400', '32px')} ${token(
		'space.100',
		'8px',
	)} ${token('space.150', '12px')}`,
	color: token('color.text', N800),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		display: 'flex',
		marginRight: token('space.100', '8px'),
	},
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N20),
	},
});
