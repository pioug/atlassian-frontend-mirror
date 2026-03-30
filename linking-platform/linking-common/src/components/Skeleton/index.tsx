/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { keyframes, jsx, css, cssMap } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import { type SkeletonProps } from './types';

const placeholderShimmer = keyframes({
	'0%': {
		backgroundPosition: '-20px 0',
	},
	'100%': {
		backgroundPosition: '60px 0',
	},
});

const appearanceValues = {
	darkGray: {
		animation: token('color.background.accent.gray.subtle'),
	},
	gray: {
		animation: token('color.skeleton'),
	},
	blue: {
		animation: token('color.background.information.hovered'),
	},
};

const spanSkeletonStyles = css({
	userSelect: 'none',
	backgroundRepeat: 'no-repeat',
	animationName: placeholderShimmer,
	animationDuration: '1s',
	animationTimingFunction: 'linear',
	animationIterationCount: 'infinite',
	animationFillMode: 'forwards',
});

const spanSkeletonBackgroundStyleMap = cssMap({
	gray: {
		backgroundColor: token('color.background.accent.gray.subtlest'),
	},
	blue: {
		backgroundColor: token('color.background.accent.blue.subtlest'),
	},
	darkGray: {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
});

export const SpanSkeleton = ({
	width,
	appearance = 'gray',
	height = 14,
	borderRadius = 0,
	isShimmering = true,
	testId,
	style = {},
}: SkeletonProps): JSX.Element => {
	return (
		<span
			data-testid={testId}
			css={[spanSkeletonStyles, spanSkeletonBackgroundStyleMap[appearance]]}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				...style,
				height: (typeof height === 'number' ? `${height}px` : height) || 'auto',
				width: (typeof width === 'number' ? `${width}px` : width) || 'auto',
				borderRadius: (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius) || 0,
				backgroundImage: `linear-gradient(
    to right,
    transparent 0%,
    ${appearanceValues[appearance].animation} 20%,
    transparent 40%,
    transparent 100%
  )`,
				backgroundSize: isShimmering ? `40px ${height}` : '0px',
			}}
		></span>
	);
};

export const Skeleton = ({
	width,
	appearance = 'gray',
	height = 14,
	borderRadius = 0,
	isShimmering = true,
	testId,
	style = {},
}: SkeletonProps): JSX.Element => {
	return (
		<div
			data-testid={testId}
			css={[spanSkeletonStyles, spanSkeletonBackgroundStyleMap[appearance]]}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				...style,
				height: (typeof height === 'number' ? `${height}px` : height) || 'auto',
				width: (typeof width === 'number' ? `${width}px` : width) || 'auto',
				borderRadius: (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius) || 0,
				backgroundImage: `linear-gradient(
    to right,
    transparent 0%,
    ${appearanceValues[appearance].animation} 20%,
    transparent 40%,
    transparent 100%
  )`,
				backgroundSize: isShimmering ? `40px ${height}` : '0px',
			}}
		></div>
	);
};

export default Skeleton;
