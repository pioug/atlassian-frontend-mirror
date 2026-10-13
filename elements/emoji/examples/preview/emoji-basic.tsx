import React from 'react';

import { Emoji } from '@atlaskit/emoji/emoji';
import type { EmojiDescription } from '@atlaskit/emoji/types';

const wavingHand: EmojiDescription = {
	id: 'wave',
	shortName: ':wave:',
	name: 'waving hand',
	category: 'people',
	representation: { unicodeEmoji: '👋' },
	searchable: true,
	type: 'standard',
};

export default function EmojiBasicPreview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<Emoji emoji={wavingHand} />
		</div>
	);
}
