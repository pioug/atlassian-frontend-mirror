/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';
import { Emoji } from '@atlaskit/emoji/element';
import type { EmojiDescription } from '@atlaskit/emoji/types';
import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';

import blueStarImage from './images/blue_star_64.png';
import blushImage from './images/people.png';

const containerStyles = css({
	maxWidth: '600px',
});

export default function Emojis(): JSX.Element {
	// Mock emoji service response to prevent external resources affecting VR test
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

	// Mock emoji service response to prevent external resources affecting VR test
	const blush: EmojiDescription = {
		id: '1f60a',
		name: 'smiling face with smiling eyes',
		fallback: '😊',
		type: 'STANDARD',
		category: 'PEOPLE',
		order: 11112,
		searchable: true,
		shortName: ':blush:',
		representation: {
			sprite: {
				url: blushImage,
				row: 36,
				column: 37,
				height: 2376,
				width: 2442,
			},
			height: 64,
			width: 64,
			x: 594,
			y: 0,
			xIndex: 9,
			yIndex: 0,
		},
	};

	const blushEmojiDefault = <Emoji emoji={blush} />;
	const blushEmojiFitToHeight = <Emoji emoji={blush} fitToHeight={24} />;
	const blushEmojiAutoWidth = <Emoji emoji={blush} autoWidth />;

	return (
		<div css={containerStyles}>
			<Stack space="space.200">
				<Heading size="medium">Atlaskit Emojis</Heading>
				<Heading size="small">Standard</Heading>
				<div>
					<Heading size="xsmall">Default</Heading>
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
				<Heading size="small">Sprite sheet emojis</Heading>
				<div>
					<Heading size="xsmall">Default</Heading>
					<Inline space="space.100" alignBlock="end">
						<Tile label="" size="xxsmall">
							{blushEmojiDefault}
						</Tile>
						<Tile label="" size="xsmall">
							{blushEmojiDefault}
						</Tile>
						<Tile label="" size="small">
							{blushEmojiDefault}
						</Tile>
						<Tile label="" size="medium">
							{blushEmojiDefault}
						</Tile>
						<Tile label="" size="large">
							{blushEmojiDefault}
						</Tile>
						<Tile label="" size="xlarge">
							{blushEmojiDefault}
						</Tile>
					</Inline>
				</div>
				<div>
					<Heading size="xsmall">With size override (should not be affected)</Heading>
					<Inline space="space.100" alignBlock="end">
						<Tile label="" size="xxsmall">
							{blushEmojiFitToHeight}
						</Tile>
						<Tile label="" size="xsmall">
							{blushEmojiFitToHeight}
						</Tile>
						<Tile label="" size="small">
							{blushEmojiFitToHeight}
						</Tile>
						<Tile label="" size="medium">
							{blushEmojiFitToHeight}
						</Tile>
						<Tile label="" size="large">
							{blushEmojiFitToHeight}
						</Tile>
						<Tile label="" size="xlarge">
							{blushEmojiFitToHeight}
						</Tile>
					</Inline>
				</div>
				<div>
					<Heading size="xsmall">With autoscaling enabled (should not be affected)</Heading>
					<Inline space="space.100" alignBlock="end">
						<Tile label="" size="xxsmall">
							{blushEmojiAutoWidth}
						</Tile>
						<Tile label="" size="xsmall">
							{blushEmojiAutoWidth}
						</Tile>
						<Tile label="" size="small">
							{blushEmojiAutoWidth}
						</Tile>
						<Tile label="" size="medium">
							{blushEmojiAutoWidth}
						</Tile>
						<Tile label="" size="large">
							{blushEmojiAutoWidth}
						</Tile>
						<Tile label="" size="xlarge">
							{blushEmojiAutoWidth}
						</Tile>
					</Inline>
				</div>
				<Heading size="medium">Unicode Emojis</Heading>
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
		</div>
	);
}
