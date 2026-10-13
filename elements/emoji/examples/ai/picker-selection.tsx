import React, { useState } from 'react';

import { EmojiPicker } from '@atlaskit/emoji/emoji-picker';
import type { EmojiProvider } from '@atlaskit/emoji/emoji-resource';
import type { EmojiId, OptionalEmojiDescription } from '@atlaskit/emoji/types';

export default function EmojiPickerSelectionExample({
	emojiProvider,
}: {
	emojiProvider: Promise<EmojiProvider>;
}): React.JSX.Element {
	const [selected, setSelected] = useState('No emoji selected');
	return (
		<div>
			<EmojiPicker
				emojiProvider={emojiProvider}
				onSelection={(id: EmojiId, emoji: OptionalEmojiDescription) =>
					setSelected(emoji?.name ?? id.shortName)
				}
			/>
			<p role="status">{selected}</p>
		</div>
	);
}
