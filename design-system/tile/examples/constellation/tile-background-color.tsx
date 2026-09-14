import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile/tile';

export default function TileBackgroundColor(): React.JSX.Element {
	return (
		<Inline space="space.100">
			<Tile label="">🌈</Tile>
			<Tile backgroundColor="color.background.neutral.bold" label="">
				🌈
			</Tile>
			<Tile backgroundColor="color.background.accent.red.subtle" label="">
				🌈
			</Tile>
			<Tile backgroundColor="color.background.accent.orange.subtle" label="">
				🌈
			</Tile>
			<Tile backgroundColor="color.background.accent.yellow.subtle" label="">
				🌈
			</Tile>
			<Tile backgroundColor="color.background.accent.lime.subtle" label="">
				🌈
			</Tile>
			<Tile backgroundColor="color.background.accent.green.subtle" label="">
				🌈
			</Tile>
			<Tile backgroundColor="color.background.accent.teal.subtle" label="">
				🌈
			</Tile>
			<Tile backgroundColor="color.background.accent.blue.subtle" label="">
				🌈
			</Tile>
			<Tile backgroundColor="color.background.accent.purple.subtle" label="">
				🌈
			</Tile>
			<Tile backgroundColor="color.background.accent.magenta.subtle" label="">
				🌈
			</Tile>
		</Inline>
	);
}
