import React from 'react';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { token } from '@atlaskit/tokens';
import { ConnectedReactionsView } from '../src';
import { Constants } from '../src/shared';
import { ExampleWrapper } from './utils';

export default function Example() {
  return (
    <ExampleWrapper>
      {(store) => (
        <div
          style={{
            width: '300px',
            border: `1px solid ${token('color.border', '#777')}`,
          }}
        >
          <p>
            <strong>
              This is a just the "ConnectedReactionsView" with a built in memory
              store and allowAllEmojis prop true (Select custom emojis) and an
              existing list of selected emojis.
            </strong>
          </p>
          <hr />
          <ConnectedReactionsView
            store={store}
            containerAri={`${Constants.ContainerAriPrefix}1`}
            ari={`${Constants.AriPrefix}1`}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
            allowAllEmojis
          />
        </div>
      )}
    </ExampleWrapper>
  );
}
