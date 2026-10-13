import React, { useState } from 'react';

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

export default function SuggestionItemExample(): React.JSX.Element {
	const [selected, setSelected] = useState(false);
	const [inserted, setInserted] = useState('');
	return (
		<div>
			<div role="group" aria-label="Emoji suggestion keyboard demo">
				<EmojiTypeAheadItem
					emoji={wave}
					selected={selected}
					onMouseMove={() => setSelected(true)}
					onSelection={() => {
						setSelected(true);
						setInserted(wave.shortName);
					}}
				/>
				<button
					type="button"
					onFocus={() => setSelected(true)}
					onClick={() => {
						setSelected(true);
						setInserted(wave.shortName);
					}}
				>
					Insert waving hand
				</button>
			</div>
			<p role="status">
				{inserted
					? `Inserted ${inserted}`
					: 'Focus the insert button and press Enter or Space to insert the suggestion'}
			</p>
		</div>
	);
}
