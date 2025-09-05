import React from 'react';

import { Emoji } from '@atlaskit/emoji/element';
import type { EmojiDescription } from '@atlaskit/emoji/types';
import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';

import blueStarImage from './images/blue_star_64.png';

export default function Basic() {
	// Mock emoji service response to keep example static
	const blueStar: EmojiDescription = {
		shortName: ':blue_star:',
		id: 'atlassian-blue_star',
		name: 'Blue star',
		category: 'SYMBOLS',
		searchable: true,
		type: 'ATLASSIAN',
		representation: {
			imagePath: blueStarImage,
			height: 64,
			width: 64,
		},
	};

	const blueStarEmojiDefault = <Emoji emoji={blueStar} />;
	const blueStarEmojiFitToHeight = <Emoji emoji={blueStar} fitToHeight={24} />;
	const blueStarEmojiAutoWidth = <Emoji emoji={blueStar} autoWidth />;

	return (
		<Stack space="space.200">
			<Heading size="small">Atlaskit Emojis</Heading>
			<div>
				<Heading size="xsmall">Standard</Heading>
				<Inline space="space.100" alignBlock="end">
					<Tile label="" size="xxsmall">
						{blueStarEmojiDefault}
					</Tile>
					<Tile label="" size="xsmall">
						{blueStarEmojiDefault}
					</Tile>
					<Tile label="" size="small">
						{blueStarEmojiDefault}
					</Tile>
					<Tile label="" size="medium">
						{blueStarEmojiDefault}
					</Tile>
					<Tile label="" size="large">
						{blueStarEmojiDefault}
					</Tile>
					<Tile label="" size="xlarge">
						{blueStarEmojiDefault}
					</Tile>
				</Inline>
			</div>
			<div>
				<Heading size="xsmall">With size override (should not be affected)</Heading>
				<Inline space="space.100" alignBlock="end">
					<Tile label="" size="xxsmall">
						{blueStarEmojiFitToHeight}
					</Tile>
					<Tile label="" size="xsmall">
						{blueStarEmojiFitToHeight}
					</Tile>
					<Tile label="" size="small">
						{blueStarEmojiFitToHeight}
					</Tile>
					<Tile label="" size="medium">
						{blueStarEmojiFitToHeight}
					</Tile>
					<Tile label="" size="large">
						{blueStarEmojiFitToHeight}
					</Tile>
					<Tile label="" size="xlarge">
						{blueStarEmojiFitToHeight}
					</Tile>
				</Inline>
			</div>
			<div>
				<Heading size="xsmall">With autoscaling enabled (should not be affected)</Heading>
				<Inline space="space.100" alignBlock="end">
					<Tile label="" size="xxsmall">
						{blueStarEmojiAutoWidth}
					</Tile>
					<Tile label="" size="xsmall">
						{blueStarEmojiAutoWidth}
					</Tile>
					<Tile label="" size="small">
						{blueStarEmojiAutoWidth}
					</Tile>
					<Tile label="" size="medium">
						{blueStarEmojiAutoWidth}
					</Tile>
					<Tile label="" size="large">
						{blueStarEmojiAutoWidth}
					</Tile>
					<Tile label="" size="xlarge">
						{blueStarEmojiAutoWidth}
					</Tile>
				</Inline>
			</div>
			<Heading size="small">Unicode Emojis</Heading>
			<div>
				<Inline space="space.100" alignBlock="end">
					<Tile label="" size="xxsmall">
						🥳
					</Tile>
					<Tile label="" size="xsmall">
						🥳
					</Tile>
					<Tile label="" size="small">
						🥳
					</Tile>
					<Tile label="" size="medium">
						🥳
					</Tile>
					<Tile label="" size="large">
						🥳
					</Tile>
					<Tile label="" size="xlarge">
						🥳
					</Tile>
				</Inline>
			</div>
		</Stack>
	);
}
