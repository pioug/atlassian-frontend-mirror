import { css } from '@emotion/react';

import { N30A, N40A, N900 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const wrapperStyle = css({
	display: 'inline-flex',
	width: '100%',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',

	boxDecorationBreak: 'clone',
	borderRadius: `${token('border.radius', '3px')}`,
	color: `${token('color.text', N900)}`,
	backgroundColor: `${token('color.background.neutral', N30A)}`,
	transition: '0.1s all ease-in-out',
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: `${token('color.background.neutral.hovered', N40A)}`,
	},
});
