import React, { useState } from 'react';

import { IntlProvider } from 'react-intl';

import type { EmojiProvider } from '@atlaskit/emoji/emoji-resource';
import { ConnectedReactionsView } from '@atlaskit/reactions/ConnectedReactionsView';
import type { Store as ReactionsStore } from '@atlaskit/reactions/types';

export default function ConnectedViewExample({
	store,
	emojiProvider,
}: {
	store: ReactionsStore;
	emojiProvider: Promise<EmojiProvider>;
}): React.JSX.Element {
	const [viewOnly, setViewOnly] = useState(false);
	return (
		<IntlProvider locale="en">
			<div>
				<button type="button" onClick={() => setViewOnly((value) => !value)}>
					{viewOnly ? 'Allow reactions' : 'View only'}
				</button>
				<ConnectedReactionsView
					store={store}
					containerAri="ari:cloud:example:container/1"
					ari="ari:cloud:example:comment/1"
					emojiProvider={emojiProvider}
					isViewOnly={viewOnly}
				/>
			</div>
		</IntlProvider>
	);
}
