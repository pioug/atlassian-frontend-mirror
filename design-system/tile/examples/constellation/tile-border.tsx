import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';

export default function TileBorder() {
	return (
		<Inline space="space.100">
			<Tile hasBorder label="">
				🚀
			</Tile>
			<Tile backgroundColor="color.background.accent.red.subtlest" hasBorder label="">
				🚀
			</Tile>
			<Tile backgroundColor="color.background.accent.lime.subtlest" hasBorder label="">
				🚀
			</Tile>
			<Tile backgroundColor="color.background.accent.purple.subtlest" hasBorder label="">
				🚀
			</Tile>
		</Inline>
	);
}
