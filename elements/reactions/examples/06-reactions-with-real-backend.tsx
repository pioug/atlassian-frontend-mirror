import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import React from 'react';
import { ConnectedReactionsView, ReactionServiceClient } from '../src';
import { ReactionsExampleWrapper } from './examples-util';

const demoAri = (id: string) => `ari:cloud:owner:demo-cloud-id:item/${id}`;
const containerAri = (id: string) =>
  `ari:cloud:owner:demo-cloud-id:container/${id}`;

const client = new ReactionServiceClient(
  'https://api-private.stg.atlassian.com/reactions',
);

export default () => (
  <ReactionsExampleWrapper client={client}>
    {(store) => (
      <React.Fragment>
        <p>First Comment</p>
        <ConnectedReactionsView
          store={store}
          containerAri={containerAri('1')}
          ari={demoAri('1')}
          emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          allowAllEmojis
        />
        <p>Second Comment</p>
        <ConnectedReactionsView
          store={store}
          containerAri={containerAri('1')}
          ari={demoAri('2')}
          emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          allowAllEmojis
        />
        <p>One more Comment</p>
        <ConnectedReactionsView
          store={store}
          containerAri={containerAri('1')}
          ari={demoAri('3')}
          emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          allowAllEmojis
        />
        <p>Last comment</p>
        <ConnectedReactionsView
          store={store}
          containerAri={containerAri('1')}
          ari={demoAri('4')}
          emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          allowAllEmojis
        />

        <div>
          Within a different Container.
          <ConnectedReactionsView
            store={store}
            containerAri={containerAri('2')}
            ari={demoAri('5')}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
            allowAllEmojis
          />
        </div>
      </React.Fragment>
    )}
  </ReactionsExampleWrapper>
);
