import React from 'react';

import Skeleton from '@atlaskit/skeleton';

import Tile from './tile';
import type { TileSkeletonProps } from './types';

/**
 * __Tile Skeleton__
 *
 * A tile skeleton is the loading state for the tile component.
 *
 */
export default function TileSkeleton({
	color,
	isShimmering,
	shimmeringEndColor,
	size = 'medium',
	testId,
}: TileSkeletonProps): React.JSX.Element {
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
