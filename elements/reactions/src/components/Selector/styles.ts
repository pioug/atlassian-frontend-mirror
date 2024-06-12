/** @jsx jsx */
import { css, keyframes } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const selectorStyle = css({
	boxSizing: 'border-box',
	display: 'flex',
	padding: 0,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const emojiStyle = css({
	display: 'inline-block',
	opacity: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.selected': {
		transition: 'transform 200ms ease-in-out  ',
		transform: 'translateY(-48px) scale(2.667)',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
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
});

/**
 * custom css styling for the emoji icon
 * @param index location of the emoji in the rendered list of items
 */
export const emojiStyleAnimation: (index: number) => React.CSSProperties = (index) => ({
	animationDelay: `${index * 50}ms`,
});
