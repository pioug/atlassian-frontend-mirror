import { EmojiProvider } from '@atlaskit/emoji/resource';
import { emoji } from '@atlaskit/util-data-test';
import React from 'react';
import { ConnectedReactionPicker, ConnectedReactionsView } from '../src';
import { ReactionsExampleWrapper } from './examples-util';

const { getEmojiResource } = emoji.storyData;
const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

export default function Example() {
  return (
    <ReactionsExampleWrapper>
      {store => (
        <div>
          <div style={{ display: 'flex' }}>
            <p>Lorem ipsum dolor sit amet...</p>
            <ConnectedReactionPicker
              store={store}
              containerAri={containerAri}
              ari={demoAri}
              emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
            />
          </div>
          <hr />
          <ConnectedReactionsView
            store={store}
            containerAri={containerAri}
            ari={demoAri}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          />
        </div>
      )}
    </ReactionsExampleWrapper>
  );
}
