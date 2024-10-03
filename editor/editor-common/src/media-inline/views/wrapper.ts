// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const wrapperStyle = css({
	display: 'inline-flex',
	width: '100%',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',

	boxDecorationBreak: 'clone',
	borderRadius: `${token('border.radius', '3px')}`,
	color: `${token('color.text')}`,
	backgroundColor: `${token('color.background.neutral')}`,
	transition: '0.1s all ease-in-out',
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: `${token('color.background.neutral.hovered')}`,
	},
});
