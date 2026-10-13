import React, { useState } from 'react';

import { Emoji } from '@atlaskit/emoji/emoji';
import EmojiPlaceholder from '@atlaskit/emoji/emoji-placeholder';
import type { EmojiDescription } from '@atlaskit/emoji/types';

const badge: EmojiDescription = {
	id: 'badge',
	shortName: ':team-badge:',
	name: 'team badge',
	category: 'custom',
	representation: { unicodeEmoji: '🏅' },
	searchable: true,
	type: 'standard',
};

export default function EmojiLoadingExample(): React.JSX.Element {
	const [loaded, setLoaded] = useState(false);
	return (
		<div>
			<button type="button" onClick={() => setLoaded((value) => !value)}>
				{loaded ? 'Show loading state' : 'Resolve emoji'}
			</button>
			{loaded ? <Emoji emoji={badge} /> : <EmojiPlaceholder shortName={badge.shortName} loading />}
		</div>
	);
}
