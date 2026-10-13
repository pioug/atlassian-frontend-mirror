import React from 'react';

import { IntlProvider } from 'react-intl';

import type { EmojiProvider } from '@atlaskit/emoji/emoji-resource';
import { ConnectedReactionPicker } from '@atlaskit/reactions/ConnectedReactionPicker';
import { ConnectedReactionsView } from '@atlaskit/reactions/ConnectedReactionsView';
import type { Store as ReactionsStore } from '@atlaskit/reactions/types';

export default function ConnectedPickerExample({
	store,
	emojiProvider,
}: {
	store: ReactionsStore;
	emojiProvider: Promise<EmojiProvider>;
}): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div>
				<p>React to this comment; choosing an emoji updates the shared view.</p>
				<ConnectedReactionPicker
					store={store}
					containerAri="ari:cloud:example:container/1"
					ari="ari:cloud:example:comment/1"
					emojiProvider={emojiProvider}
				/>
				<ConnectedReactionsView
					store={store}
					containerAri="ari:cloud:example:container/1"
					ari="ari:cloud:example:comment/1"
					emojiProvider={emojiProvider}
				/>
			</div>
		</IntlProvider>
	);
}
