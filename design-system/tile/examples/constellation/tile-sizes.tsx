import React from 'react';

import { Emoji } from '@atlaskit/emoji/element';
import { Inline } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';
import { getEmojiRepository } from '@atlaskit/util-data-test/get-emoji-repository';

const emojiService = getEmojiRepository();
const blush = emojiService.findByShortName(':blush:');

export default function TileSizes(): React.JSX.Element {
	if (!blush) {
		return <span>Blush emoji not found</span>;
	}

	return (
		<Inline space="space.100" alignBlock="end">
			<Tile size="xxsmall" label="Extra extra small tile (16px)">
				<Emoji emoji={blush} />
			</Tile>
			<Tile size="xsmall" label="Extra small tile (20px)">
				<Emoji emoji={blush} />
			</Tile>
			<Tile size="small" label="Small tile (24px)">
				<Emoji emoji={blush} />
			</Tile>
			<Tile size="medium" label="Medium tile (32px)">
				<Emoji emoji={blush} />
			</Tile>
			<Tile size="large" label="Large tile (40px)">
				<Emoji emoji={blush} />
			</Tile>
			<Tile size="xlarge" label="Extra large tile (48px)">
				<Emoji emoji={blush} />
			</Tile>
		</Inline>
	);
}
