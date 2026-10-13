import React from 'react';

import { EmojiTypeAheadItem } from '@atlaskit/emoji/emoji-type-ahead-item';
import type { EmojiDescription } from '@atlaskit/emoji/types';

const wave: EmojiDescription = {
	id: 'wave',
	shortName: ':wave:',
	name: 'waving hand',
	category: 'people',
	representation: { unicodeEmoji: '👋' },
	searchable: true,
	type: 'standard',
};

export default function EmojiTypeAheadItemPreview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<EmojiTypeAheadItem emoji={wave} onMouseMove={() => {}} onSelection={() => {}} selected />
		</div>
	);
}
