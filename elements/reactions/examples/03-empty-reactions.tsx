import { EmojiProvider } from '@atlaskit/emoji/resource';
import { emoji } from '@atlaskit/util-data-test';
import React from 'react';
import { ConnectedReactionsView } from '../src';
import { ReactionsExampleWrapper } from './examples-util';

const { getEmojiResource } = emoji.storyData;
const demoAri2 = 'ari:cloud:owner:demo-cloud-id:item/2';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

export default function Example() {
  return (
    <ReactionsExampleWrapper>
      {store => (
        <div>
          <p>This is a message with some reactions</p>
          <ConnectedReactionsView
            store={store}
            containerAri={containerAri}
            ari={demoAri2}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
            allowAllEmojis={true}
          />
        </div>
      )}
    </ReactionsExampleWrapper>
  );
}
