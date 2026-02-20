/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// Copied from platform/packages/ai-mate/rovo-platform-ui-components/src/ui/primitives/ellipses-animation/EllipsesAnimation.tsx
import { css, jsx, keyframes } from '@compiled/react';

const animation = keyframes({
	'0%': {
		opacity: 0,
	},
	'24%': {
		opacity: 0,
	},
	'25%': {
		opacity: 1,
	},
	'99%': {
		opacity: 1,
	},
	'100%': {
		opacity: 0,
	},
});

const animation1 = keyframes({
	'0%': {
		opacity: 0,
	},
	'49%': {
		opacity: 0,
	},
	'50%': {
		opacity: 1,
	},
	'99%': {
		opacity: 1,
	},
	'100%': {
		opacity: 0,
	},
});

const animation2 = keyframes({
	'0%': {
		opacity: 0,
	},
	'74%': {
		opacity: 0,
	},
	'75%': {
		opacity: 1,
	},
	'99%': {
		opacity: 1,
	},
	'100%': {
		opacity: 0,
	},
});

const dot1 = css({
	animation: `${animation} 1.5s forwards infinite`,
});

const dot2 = css({
	animation: `${animation1} 1.5s forwards infinite`,
});

const dot3 = css({
	animation: `${animation2} 1.5s forwards infinite`,
});

const animatedOpacity = css({
	opacity: 0,
});

export const EllipsesAnimation = ({ isAnimated = true }: { isAnimated?: boolean }) => {
	return (
		<svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				css={isAnimated && dot1}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={isAnimated && animatedOpacity}
				d="M0.0800781 2V0.414062H1.67969V2H0.0800781Z"
				fill="#1868DB"
			/>
			<path
				css={isAnimated && dot2}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={isAnimated && animatedOpacity}
				d="M3.83984 2V0.414062H5.43945V2H3.83984Z"
				fill="#BF63F3"
			/>
			<path
				css={isAnimated && dot3}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={isAnimated && animatedOpacity}
				d="M7.59961 2V0.414062H9.19922V2H7.59961Z"
				fill="#FCA700"
			/>
		</svg>
	);
};
