import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import React from 'react';
import { ConnectedReactionsView } from '../src';
import { ReactionsExampleWrapper } from './examples-util';

const demoAri = 'ari:cloud:owner:demo-cloud-id:item/';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/';

export default function Example() {
  return (
    <ReactionsExampleWrapper>
      {(store) => (
        <div>
          <p>This is a message with some reactions</p>
          <ConnectedReactionsView
            store={store}
            containerAri={`${containerAri}1`}
            ari={`${demoAri}1`}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          />
          <p>This is another message with some reactions</p>
          <ConnectedReactionsView
            store={store}
            containerAri={`${containerAri}2`}
            ari={`${demoAri}2`}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          />
        </div>
      )}
    </ReactionsExampleWrapper>
  );
}
