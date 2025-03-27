import React from 'react';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView, type StorePropInput } from '../src';
import { ExampleWrapper, Constants } from './utils';

export default () => {
	return (
		<ExampleWrapper>
			{(store: StorePropInput) => (
				<div>
					<p>
						<strong>
							A "ConnectedReactionsView" with a built in memory store, and with:
							<ul>
								<li>containerAri = {Constants.ContainerAriPrefix}1</li>
								<li>ari = {Constants.AriPrefix}1</li>
							</ul>
							This renders the mockData from the mockClient object (as containerAri and ari are
							matching key)
						</strong>
					</p>
					<hr role="presentation" />
					<ConnectedReactionsView
						store={store}
						containerAri={`${Constants.ContainerAriPrefix}1`}
						ari={`${Constants.AriPrefix}1`}
						emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
					/>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginTop: '30px' }}>
						<p>
							<strong>
								A "ConnectedReactionsView" with a built in memory store, and with:
								<ul>
									<li>containerAri = {Constants.ContainerAriPrefix}2</li>
									<li>ari = {Constants.AriPrefix}2</li>
								</ul>
								This renders an empty selected list from the mockClient object
							</strong>
						</p>
						<hr role="presentation" />
					</div>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ marginLeft: '10px' }}>
						<ConnectedReactionsView
							store={store}
							containerAri={`${Constants.ContainerAriPrefix}2`}
							ari={`${Constants.AriPrefix}2`}
							emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
						/>
					</div>
				</div>
			)}
		</ExampleWrapper>
	);
};
