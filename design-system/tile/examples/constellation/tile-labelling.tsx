import React from 'react';

import Heading from '@atlaskit/heading';
import Image from '@atlaskit/image';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';

import FigmaLogo from '../images/figma.png';

export default function TileLabelling() {
	return (
		<Stack space="space.200">
			<Heading size="medium">Non-decorative tile with a label</Heading>
			<Tile label="Surprised face">😯</Tile>
			<Heading size="medium">Decorative tile without a label</Heading>
			<Inline space="space.100" alignBlock="center">
				{/* This tile is already described by accompanying text, so no label is needed */}
				<Tile label="" isInset={false}>
					<Image src={FigmaLogo} alt="" />
				</Tile>
				<Heading size="small">Figma</Heading>
			</Inline>
		</Stack>
	);
}
