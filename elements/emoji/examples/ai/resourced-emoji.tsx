import React, { useState } from 'react';

import type { EmojiProvider } from '@atlaskit/emoji/emoji-resource';
import ResourcedEmoji from '@atlaskit/emoji/resourced-emoji';

export default function ResourcedEmojiExample({
	emojiProvider,
}: {
	emojiProvider: Promise<EmojiProvider>;
}): React.JSX.Element {
	const [shortName, setShortName] = useState(':wave:');
	return (
		<div>
			<button
				type="button"
				onClick={() => setShortName((name) => (name === ':wave:' ? ':thumbsup:' : ':wave:'))}
			>
				Change example emoji
			</button>
			<ResourcedEmoji emojiId={{ shortName }} emojiProvider={emojiProvider} />
		</div>
	);
}
