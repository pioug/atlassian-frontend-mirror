/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, type NamedExoticComponent } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { SkeletonProps } from '../types';

const skeletonStyles = css({
	display: 'inline-block',
	borderRadius: token('radius.full', '50%'),
});

const subtleOpacityStyles = css({
	opacity: 0.15,
});

const strongOpacityStyles = css({
	opacity: 0.3,
});

const sizeStyles = cssMap({
	small: {
		width: '16px',
		height: '16px',
	},
	medium: {
		width: '24px',
		height: '24px',
	},
	large: {
		width: '32px',
		height: '32px',
	},
	xlarge: {
		width: '48px',
		height: '48px',
	},
});

/**
 * __Skeleton__
 */
const Skeleton: NamedExoticComponent<SkeletonProps> = memo(function Skeleton({
	testId,
	size = 'medium',
	color = 'currentColor',
	weight = 'normal',
}: SkeletonProps) {
	return (
		<div
			data-testid={testId}
			style={{ backgroundColor: color }}
			css={[
				skeletonStyles,
				weight === 'strong' ? strongOpacityStyles : subtleOpacityStyles,
				sizeStyles[size],
			]}
		/>
	);
});

export default Skeleton;
