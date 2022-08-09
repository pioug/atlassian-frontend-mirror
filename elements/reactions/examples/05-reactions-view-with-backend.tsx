import React from 'react';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView, ReactionServiceClient } from '../src';
import { Constants } from '../src/shared';
import { ExampleWrapper, getReactionsConfig } from './utils';

const reactionsConfig = getReactionsConfig();

const client = new ReactionServiceClient(
  reactionsConfig.baseUrl,
  reactionsConfig.authHeader,
);

const emojiProvider = getEmojiResource({
  uploadSupported: true,
}) as Promise<EmojiProvider>;

export default () => (
  <ExampleWrapper client={client}>
    {(store) => (
      <React.Fragment>
        <p>First Comment</p>
        <ConnectedReactionsView
          store={store}
          containerAri={`${Constants.ContainerAriPrefix}1`}
          ari={`${Constants.AriPrefix}1`}
          emojiProvider={emojiProvider}
          allowAllEmojis
        />
        <hr />
        <p>Second Comment</p>
        <ConnectedReactionsView
          store={store}
          containerAri={`${Constants.ContainerAriPrefix}1`}
          ari={`${Constants.AriPrefix}2`}
          emojiProvider={emojiProvider}
          allowAllEmojis
        />
        <hr />
        <p>One more Comment</p>
        <ConnectedReactionsView
          store={store}
          containerAri={`${Constants.ContainerAriPrefix}1`}
          ari={`${Constants.AriPrefix}3`}
          emojiProvider={emojiProvider}
          allowAllEmojis
        />
        <hr />
        <p>Last comment</p>
        <ConnectedReactionsView
          store={store}
          containerAri={`${Constants.ContainerAriPrefix}1`}
          ari={`${Constants.AriPrefix}4`}
          emojiProvider={emojiProvider}
          allowAllEmojis
        />
        <hr />
        <div>
          Within a different Container.
          <ConnectedReactionsView
            store={store}
            containerAri={`${Constants.ContainerAriPrefix}2`}
            ari={`${Constants.AriPrefix}5`}
            emojiProvider={emojiProvider}
            allowAllEmojis
          />
        </div>
      </React.Fragment>
    )}
  </ExampleWrapper>
);
