/** @jsx jsx */
import { css, keyframes } from '@emotion/react';
import { B75, B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const flashTime = 700;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const flashAnimation = keyframes({
	'0%': {
		backgroundColor: 'transparent',
	},
	'20%': {
		backgroundColor: token('color.background.selected.pressed', B75),
		borderColor: token('color.border.selected', B300),
	},
	'75%': {
		backgroundColor: token('color.background.selected.pressed', B75),
		borderColor: token('color.border.selected', B300),
	},
	'100%': {
		backgroundColor: token('color.background.selected.pressed', B75),
		borderColor: token('color.border.selected', B300),
	},
}) as unknown as typeof keyframes;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const containerStyle = css({
	width: '100%',
	height: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const flashStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	animation: `${flashAnimation} ${flashTime}ms ease-in-out`,
});
