import React from 'react';
import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView, ReactionServiceClient, type StorePropInput } from '../src';
import { ExampleWrapper, getReactionsConfig } from './utils';

/**
 * Used real reactions containerAri and ari from https://reactions-example.jira-dev.com/, for better demo purpose
 */
const DemoCloudId = `9d389a76-663e-492d-816c-790bd9f81d8b`; // site id of reactions-example.jira-dev.com
const DemoAriPrefix = `ari:cloud:jira:${DemoCloudId}:comment/`;
const DemoContainerAriPrefix = `ari:cloud:jira:${DemoCloudId}:issue/`;

const reactionsConfig = getReactionsConfig();

const client = new ReactionServiceClient(reactionsConfig.baseUrl, reactionsConfig.authHeader);

const emojiProvider = getEmojiResource({
	uploadSupported: true,
}) as Promise<EmojiProvider>;

export default () => (
	<ExampleWrapper client={client}>
		{(store: StorePropInput) => (
			<React.Fragment>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ marginLeft: '10px' }}>
					<p>First Comment</p>
					<ConnectedReactionsView
						store={store}
						containerAri={`${DemoContainerAriPrefix}10001`}
						ari={`${DemoAriPrefix}10002`}
						emojiProvider={emojiProvider}
						allowAllEmojis
					/>
					<hr role="presentation" />
					<p>Second Comment</p>
					<ConnectedReactionsView
						store={store}
						containerAri={`${DemoContainerAriPrefix}10001`}
						ari={`${DemoAriPrefix}10003`}
						emojiProvider={emojiProvider}
						allowAllEmojis
					/>
					<hr role="presentation" />
					<p>One more Comment</p>
					<ConnectedReactionsView
						store={store}
						containerAri={`${DemoContainerAriPrefix}10001`}
						ari={`${DemoAriPrefix}10004`}
						emojiProvider={emojiProvider}
						allowAllEmojis
					/>
					<hr role="presentation" />
					<p>Last comment</p>
					<ConnectedReactionsView
						store={store}
						containerAri={`${DemoContainerAriPrefix}10001`}
						ari={`${DemoAriPrefix}10005`}
						emojiProvider={emojiProvider}
						allowAllEmojis
					/>
					<hr role="presentation" />
					<div>
						Within a different Container.
						<ConnectedReactionsView
							store={store}
							containerAri={`${DemoContainerAriPrefix}10000`}
							ari={`${DemoAriPrefix}10001`}
							emojiProvider={emojiProvider}
							allowAllEmojis
						/>
					</div>
				</div>
			</React.Fragment>
		)}
	</ExampleWrapper>
);
