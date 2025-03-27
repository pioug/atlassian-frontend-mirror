import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import React from 'react';
import { ConnectedReactionsView, type StorePropInput } from '../src';
import { Example, Constants as ExampleConstants, ExampleWrapper } from './utils';

export default () => {
	return (
		<ExampleWrapper>
			{(store: StorePropInput) => (
				<>
					<Example
						title={'Reaction Picker Only'}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}1`}
								ari={`${ExampleConstants.AriPrefix}1`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowAllEmojis
								onlyRenderPicker
							/>
						}
					/>

					<hr role="presentation" />

					<Example
						title={'Reaction Picker Only - empty state'}
						body={
							<ConnectedReactionsView
								store={store}
								containerAri={`${ExampleConstants.ContainerAriPrefix}2`}
								ari={`${ExampleConstants.AriPrefix}2`}
								emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
								allowAllEmojis
								onlyRenderPicker
							/>
						}
					/>
					<hr role="presentation" />
				</>
			)}
		</ExampleWrapper>
	);
};
