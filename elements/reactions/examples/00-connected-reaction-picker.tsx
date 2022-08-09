import React from 'react';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionPicker } from '../src';
import { Constants } from '../src/shared';
import { ExampleWrapper } from './utils';

export default function Example() {
  return (
    <ExampleWrapper>
      {(store) => (
        <div>
          <p>
            <strong>Memory Store and Connected Picker View</strong>
          </p>
          <hr />
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <p>picker selector</p>
            <ConnectedReactionPicker
              store={store}
              containerAri={`${Constants.ContainerAriPrefix}1`}
              ari={`${Constants.AriPrefix}1`}
              emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
            />
          </div>
        </div>
      )}
    </ExampleWrapper>
  );
}
