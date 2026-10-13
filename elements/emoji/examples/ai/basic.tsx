import React, { useState } from 'react';

import { Emoji } from '@atlaskit/emoji/emoji';
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

export default function EmojiMessageExample(): React.JSX.Element {
	const [selected, setSelected] = useState(false);
	return (
		<div>
			<p>Welcome back</p>
			<button type="button" aria-pressed={selected} onClick={() => setSelected((value) => !value)}>
				<Emoji emoji={wave} selected={selected} isDecorative />
				{selected ? 'Greeting selected' : 'Select greeting'}
			</button>
			<p role="status">{selected ? 'Greeting selected' : 'Select the greeting emoji'}</p>
		</div>
	);
}
