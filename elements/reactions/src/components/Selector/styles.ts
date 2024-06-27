/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, keyframes } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-keyframes -- Ignored via go/DSP-18766
export const revealAnimation = keyframes({
	'0%': {
		opacity: 1,
		transform: 'scale(0.5)',
	},
	'75%': {
		transform: 'scale(1.25)',
	},
	'100%': {
		opacity: 1,
		transform: 'scale(1)',
	},
}) as unknown as typeof keyframes;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const revealStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	animation: `${revealAnimation} 150ms ease-in-out forwards`,
	opacity: 0,
});
