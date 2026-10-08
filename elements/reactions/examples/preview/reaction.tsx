import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { EmojiResource } from '@atlaskit/emoji/emoji-resource';
import type { EmojiDescription, EmojiId } from '@atlaskit/emoji/types';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { Reaction } from '../../src/components/Reaction';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});
const emojis: EmojiDescription[] = [
	{
		id: 'smile',
		shortName: ':smile:',
		name: 'Smile',
		type: 'STANDARD',
		category: 'PEOPLE',
		searchable: true,
		representation: { unicodeEmoji: '😄' },
	},
	{
		id: 'celebrate',
		shortName: ':tada:',
		name: 'Celebrate',
		type: 'STANDARD',
		category: 'ACTIVITY',
		searchable: true,
		representation: { unicodeEmoji: '🎉' },
	},
	{
		id: 'heart',
		shortName: ':heart:',
		name: 'Heart',
		type: 'STANDARD',
		category: 'SYMBOLS',
		searchable: true,
		representation: { unicodeEmoji: '❤️' },
	},
];
class LocalEmojiResource extends EmojiResource {
	findById(id: string) {
		return emojis.find((emoji) => emoji.id === id);
	}
	findByEmojiId(id: EmojiId) {
		return this.findById(id.id!);
	}
}

export const previewOptions = { width: 'fit-content', scale: 1.8 } as const;
export default function Preview(): React.JSX.Element {
	const provider = React.useMemo(
		() =>
			Promise.resolve(
				new LocalEmojiResource({
					providers: [{ url: 'data:application/json,%7B%22emojis%22%3A%5B%5D%7D' }],
					options: { onlyFetchOnDemand: true },
				}),
			),
		[],
	);
	return (
		<Box testId="component-preview" xcss={styles.subject}>
			<IntlProvider locale="en">
				{emojis.map((emoji, index) => (
					<Reaction
						key={emoji.id}
						emojiProvider={provider}
						reaction={{
							ari: 'reaction',
							containerAri: 'project',
							emojiId: emoji.id!,
							count: [4, 2, 3][index],
							reacted: index === 0,
						}}
						onClick={() => {}}
					/>
				))}
			</IntlProvider>
		</Box>
	);
}
