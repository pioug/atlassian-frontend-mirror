import React from 'react';

import { IntlProvider } from 'react-intl';

import { type EmojiProvider } from '@atlaskit/emoji/emoji-resource';
import { ConnectedReactionsView } from '@atlaskit/reactions/ConnectedReactionsView';
import { MemoryReactionsStore } from '@atlaskit/reactions/MemoryReactionsStore';
import { ari, containerAri, MockReactionsClient } from '@atlaskit/reactions/MockReactionsClient';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

const store = new MemoryReactionsStore(new MockReactionsClient(0), undefined, {
	subproduct: 'atlaskit',
});

export default function ConnectedReactionsViewPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<ConnectedReactionsView
					store={store}
					containerAri={containerAri}
					ari={ari}
					emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
				/>
			</div>
		</IntlProvider>
	);
}
