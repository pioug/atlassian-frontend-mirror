import React, { useState } from 'react';

import { Emoji } from '@atlaskit/emoji/emoji';
import { getStandardEmojis } from '@atlaskit/util-data-test/get-standard-emojis';

const wave = getStandardEmojis().find((emoji) => emoji.shortName === ':wave:')!;

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
