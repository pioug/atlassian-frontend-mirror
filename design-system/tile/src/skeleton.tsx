import React from 'react';

import Skeleton from '@atlaskit/skeleton';

import Tile from './tile';
import type { SkeletonProps } from './types';

/**
 * __Skeleton__
 *
 * A skeleton is the loading state for the tile component.
 *
 */
export default function TileSkeleton({
	color,
	isShimmering,
	shimmeringEndColor,
	size = 'medium',
	testId,
}: SkeletonProps) {
	return (
		<Tile label="" size={size} testId={testId} backgroundColor="transparent">
			<Skeleton
				color={color}
				isShimmering={isShimmering}
				ShimmeringEndColor={shimmeringEndColor}
				width={'100%'}
				height={'100%'}
				testId={testId ? `${testId}--skeleton` : undefined}
			/>
		</Tile>
	);
}
