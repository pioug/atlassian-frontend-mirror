import React from 'react';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView, type StorePropInput } from '../src';
import { MockReactionsClient } from '../src/MockReactionsClient';
import { ExampleWrapper, Example, Constants as ExampleConstants } from './utils';

export default (): React.JSX.Element => {
	const client = new MockReactionsClient(500, true);
	return (
		<ExampleWrapper client={client}>
			{(store: StorePropInput) => (
				<>
					<p>
						Reactions Dialog is an extended view of a reaction user list. It's enabled by setting
						the prop "allowUserDialog" to true, this then shows a link within the reaction tooltip
						to show a full user list associated with all reactions
					</p>

					<hr role="presentation" />
					<Example
						title={'Connected reactions with reactions dialog enabled'}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowUserDialog
							/>
						}
					/>
				</>
			)}
		</ExampleWrapper>
	);
};
