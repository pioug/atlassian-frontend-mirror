import React from 'react';

import Image from '@atlaskit/image';
import { Inline } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';

import FigmaLogo from '../images/figma.png';

export default function TileInset(): React.JSX.Element {
	return (
		<Inline space="space.100">
			<Tile
				label="Tile with inset (default)"
				backgroundColor="color.background.accent.green.subtler"
				size="xlarge"
			>
				🐵
			</Tile>
			<Tile isInset={false} label="Tile without inset" size="xlarge">
				<Image src={FigmaLogo} alt="" />
			</Tile>
		</Inline>
	);
}
