/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { memo } from 'react';

import { token } from '@atlaskit/tokens';

import type { SkeletonProps } from '../types';
import { sizeStyleMap } from './styles';

const skeletonStyles = css({
	display: 'inline-block',
	borderRadius: token('border.radius.circle', '50%'),
});

const subtleOpacityStyles = css({
	opacity: 0.15,
});

const strongOpacityStyles = css({
	opacity: 0.3,
});

/**
 * __Skeleton__
 */
const Skeleton = memo(function Skeleton({
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				sizeStyleMap[size],
			]}
		/>
	);
});

export default Skeleton;
