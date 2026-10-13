import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import type { EmojiProvider } from '@atlaskit/emoji/emoji-resource';
import { ReactionPicker } from '@atlaskit/reactions/ReactionPicker';

export default function ReactionPickerExample({
	emojiProvider,
}: {
	emojiProvider: Promise<EmojiProvider>;
}): React.JSX.Element {
	const [selected, setSelected] = useState('No reaction selected');
	return (
		<IntlProvider locale="en">
			<div>
				<ReactionPicker
					emojiProvider={emojiProvider}
					onSelection={(emojiId) => setSelected(`Selected reaction ${emojiId}`)}
				/>
				<p role="status">{selected}</p>
			</div>
		</IntlProvider>
	);
}
