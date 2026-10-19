import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import type { EmojiProvider } from '@atlaskit/emoji/types';
import { Reaction } from '@atlaskit/reactions/Reaction';

export default function ReactionButtonExample({
	emojiProvider,
}: {
	emojiProvider: Promise<EmojiProvider>;
}): React.JSX.Element {
	const [reaction, setReaction] = useState({ reacted: false, count: 3 });
	return (
		<IntlProvider locale="en">
			<Reaction
				emojiProvider={emojiProvider}
				reaction={{
					ari: 'ari:cloud:host:comment/456',
					containerAri: 'ari:cloud:host:container/123',
					emojiId: '1f44d',
					...reaction,
				}}
				onClick={() =>
					setReaction((current) => ({
						reacted: !current.reacted,
						count: current.count + (current.reacted ? -1 : 1),
					}))
				}
			/>
		</IntlProvider>
	);
}
