import React, { useRef, useState } from 'react';

import type { EmojiProvider } from '@atlaskit/emoji/emoji-resource';
import EmojiTypeAhead from '@atlaskit/emoji/emoji-type-ahead';
import type { EmojiId, OptionalEmojiDescription } from '@atlaskit/emoji/types';

export default function EmojiTypeAheadInputExample({
	emojiProvider,
}: {
	emojiProvider: Promise<EmojiProvider>;
}): React.JSX.Element {
	const [query, setQuery] = useState(':wave');
	const [message, setMessage] = useState('');
	const typeAhead = useRef<EmojiTypeAhead>(null);
	return (
		<div>
			<label htmlFor="message">Emoji short name</label>
			<input
				id="message"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'ArrowDown') {
						event.preventDefault();
						typeAhead.current?.selectNext();
					}
					if (event.key === 'ArrowUp') {
						event.preventDefault();
						typeAhead.current?.selectPrevious();
					}
					if (event.key === 'Enter') {
						event.preventDefault();
						typeAhead.current?.chooseCurrentSelection();
					}
					if (event.key === 'Escape') {
						event.preventDefault();
						setQuery('');
					}
				}}
			/>
			<EmojiTypeAhead
				ref={typeAhead}
				emojiProvider={emojiProvider}
				query={query}
				onSelection={(id: EmojiId, emoji: OptionalEmojiDescription) => {
					setMessage((value) => `${value}${emoji?.shortName ?? id.shortName}`);
					setQuery('');
				}}
			/>
			<p aria-live="polite">{message}</p>
		</div>
	);
}
