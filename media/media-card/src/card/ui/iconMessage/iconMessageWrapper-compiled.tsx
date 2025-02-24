/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx, keyframes } from '@compiled/react';
import { type IconMessageWrapperProps } from './types';

import { token } from '@atlaskit/tokens';

const breatheAnimation = keyframes({
	'0%': {
		opacity: 1,
	},
	'50%': {
		opacity: 0.3,
	},
	'100%': {
		opacity: 1,
	},
});

const animatedStyles = css({
	animationName: breatheAnimation,
	animationDuration: '3.5s',
	animationTimingFunction: 'ease-in-out',
	animationIterationCount: 'infinite',
});

const baseStyles = css({
	overflow: 'hidden',
	opacity: 1,
	fontWeight: token('font.weight.medium'),
	color: token('color.text.subtlest', '#7A869A'),
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginBottom: '-1em', // Needs pixel precision to align the icon at the center of the box
	paddingBlock: token('space.050'),
	paddingInline: token('space.100'),
});

export const IconMessageWrapper = (props: IconMessageWrapperProps) => {
	const { animated } = props;

	return (
		<div id="iconMessageWrapper" css={[baseStyles, animated && animatedStyles]}>
			{props.children}
		</div>
	);
};
