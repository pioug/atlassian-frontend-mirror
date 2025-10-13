import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';

export default function TileBackgroundColorStatic() {
	return (
		<Inline space="space.100">
			<Tile backgroundColor="white" label="" hasBorder>
				🌈
			</Tile>
			<Tile backgroundColor="black" label="" hasBorder>
				🌈
			</Tile>
		</Inline>
	);
}
