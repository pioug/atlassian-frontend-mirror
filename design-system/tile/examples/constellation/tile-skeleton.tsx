import React, { useState } from 'react';

import { Emoji } from '@atlaskit/emoji/element';
import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Skeleton from '@atlaskit/skeleton';
import Tile from '@atlaskit/tile';
import TileSkeleton from '@atlaskit/tile/skeleton';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';
import { getEmojiRepository } from '@atlaskit/util-data-test/get-emoji-repository';

const emojiService = getEmojiRepository();
const blush = emojiService.findByShortName(':blush:');

export default function TileSkeletonExample(): React.JSX.Element {
	const [isLoading, setIsLoading] = useState(true);

	if (!blush) {
		return <span>Blush emoji not found</span>;
	}

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
								<Emoji emoji={blush} />
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
								<Emoji emoji={blush} />
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
								<Emoji emoji={blush} />
							</Tile>
							<Heading size="small">Custom color skeleton</Heading>
						</>
					)}
				</Inline>
			</Stack>
		</Stack>
	);
}
