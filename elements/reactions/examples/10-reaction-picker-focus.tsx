import React from 'react';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionPicker, StorePropInput } from '../src';
import { ExampleWrapper, Example, Constants } from './utils';

export default () => {
  return (
    <ExampleWrapper>
      {(store: StorePropInput) => (
        <Example
          title={'Focus test'}
          body={
            <ConnectedReactionPicker
              store={store}
              containerAri={`${Constants.ContainerAriPrefix}1`}
              ari={`${Constants.AriPrefix}1`}
              emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
              allowAllEmojis
            />
          }
        />
      )}
    </ExampleWrapper>
  );
};
