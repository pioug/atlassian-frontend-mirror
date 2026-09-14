import React, { useState } from 'react';

import Heading from '@atlaskit/heading/heading';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/skeleton';
import Tile from '@atlaskit/tile/tile';
import TileSkeleton from '@atlaskit/tile/tile-skeleton';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

export default function TileSkeletonExample(): React.JSX.Element {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<Stack space="space.200">
			<Inline space="space.050" alignBlock="center">
				<Toggle
					id="loading-toggle"
					isChecked={isLoading}
					onChange={() => setIsLoading(!isLoading)}
				/>
				<label htmlFor="loading-toggle">Show loading state</label>
			</Inline>
			<Stack space="space.150">
				<Inline space="space.100" alignBlock="center">
					{isLoading ? (
						<>
							<TileSkeleton size="large" />
							<Skeleton width="140px" height="20px" />
						</>
					) : (
						<>
							<Tile label="" size="large">
								😊
							</Tile>
							<Heading size="small">Standard skeleton</Heading>
						</>
					)}
				</Inline>
				<Inline space="space.100" alignBlock="center">
					{isLoading ? (
						<>
							<TileSkeleton size="large" isShimmering />
							<Skeleton width="140px" height="20px" isShimmering />
						</>
					) : (
						<>
							<Tile size="large" label="">
								😊
							</Tile>
							<Heading size="small">Shimmering skeleton</Heading>
						</>
					)}
				</Inline>
				<Inline space="space.100" alignBlock="center">
					{isLoading ? (
						<>
							<TileSkeleton
								size="large"
								isShimmering
								color={token('color.background.accent.blue.subtler')}
								shimmeringEndColor={token('color.background.accent.blue.subtlest')}
							/>
							<Skeleton width="140px" height="20px" isShimmering />
						</>
					) : (
						<>
							<Tile size="large" label="" backgroundColor="color.background.accent.blue.subtle">
								😊
							</Tile>
							<Heading size="small">Custom color skeleton</Heading>
						</>
					)}
				</Inline>
			</Stack>
		</Stack>
	);
}
