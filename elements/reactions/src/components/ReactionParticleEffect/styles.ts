import { layers } from '@atlaskit/theme/constants';

import { css, keyframes } from '@emotion/react';

const fade = keyframes({
	'0%': {
		opacity: 0,
	},
	'20%': {
		opacity: 1,
	},
	'60%': {
		opacity: 1,
	},
	'100%': {
		opacity: 0,
	},
});

const float = keyframes({
	'0%': {
		transform: 'translateY(0) scale(1)',
	},
	'100%': {
		transform: 'translateY(-120px) scale(1.7)',
	},
});

export const containerStyle = css({
	position: 'relative',
	left: 8,

	// Ensure the effect displays above tooltips
	zIndex: layers.tooltip() + 1,
});

export const reactionParticleStyle = css({
	position: 'absolute',
	top: 0,
	left: 0,
	pointerEvents: 'none',
	opacity: 0,
	animation: `${fade} ease-in-out, ${float} ease`,
	animationDuration: '700ms',

	// Override position and delay for each particle
	':nth-child(2)': {
		left: -5,
		animationDelay: '0.15s',
	},
	':nth-child(3)': {
		left: 8,
		animationDelay: '0.3s',
	},
	':nth-child(4)': {
		left: -1,
		animationDelay: '0.45s',
	},
});
