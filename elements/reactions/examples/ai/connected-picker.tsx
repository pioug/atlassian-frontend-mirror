import React from 'react';

import { IntlProvider } from 'react-intl';

import type { EmojiProvider } from '@atlaskit/emoji/types';
import { ConnectedReactionPicker } from '@atlaskit/reactions/ConnectedReactionPicker';
import { ConnectedReactionsView } from '@atlaskit/reactions/ConnectedReactionsView';
import type { Store as ReactionsStore } from '@atlaskit/reactions/store';

export default function ConnectedPickerExample({
	store,
	emojiProvider,
}: {
	emojiProvider: Promise<EmojiProvider>;
	store: ReactionsStore;
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
