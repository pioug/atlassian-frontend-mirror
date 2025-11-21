import React from 'react';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionPicker, ConnectedReactionsView, type StorePropInput } from '../src';
import { ExampleWrapper, Example, Constants } from './utils';

export default (): React.JSX.Element => {
	return (
		<ExampleWrapper>
			{(store: StorePropInput) => (
				<>
					<p>
						<strong>Memory store and Connected Picker view (same store)</strong>
					</p>
					<hr role="presentation" />
					<Example
						title={'Regular picker view'}
						body={
							<ConnectedReactionPicker
								store={store}
								containerAri={`${Constants.ContainerAriPrefix}1`}
								ari={`${Constants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
							/>
						}
					/>
					<hr role="presentation" />
					<Example
						title={
							'Use picker to add reaction, it will update reactions in a separate ConnectedReactionsView component below.'
						}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${Constants.ContainerAriPrefix}1`}
								ari={`${Constants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
							/>
						}
					/>
				</>
			)}
		</ExampleWrapper>
	);
};
