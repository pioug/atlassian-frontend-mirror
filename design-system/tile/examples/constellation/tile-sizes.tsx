import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile/tile';

export default function TileSizes(): React.JSX.Element {
	return (
		<Inline space="space.100" alignBlock="end">
			<Tile size="xxsmall" label="Extra extra small tile (16px)">
				😊
			</Tile>
			<Tile size="xsmall" label="Extra small tile (20px)">
				😊
			</Tile>
			<Tile size="small" label="Small tile (24px)">
				😊
			</Tile>
			<Tile size="medium" label="Medium tile (32px)">
				😊
			</Tile>
			<Tile size="large" label="Large tile (40px)">
				😊
			</Tile>
			<Tile size="xlarge" label="Extra large tile (48px)">
				😊
			</Tile>
		</Inline>
	);
}
