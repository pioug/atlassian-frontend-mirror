import React from 'react';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView } from '../src';
import { Constants } from '../src/shared';
import { ExampleWrapper } from './utils';

export default function Example() {
  return (
    <ExampleWrapper>
      {(store) => (
        <div>
          <p>
            <strong>
              This is a just the "ConnectedReactionsView" with a built in memory
              store.
            </strong>
          </p>
          <hr />
          <ConnectedReactionsView
            store={store}
            containerAri={`${Constants.ContainerAriPrefix}1`}
            ari={`${Constants.AriPrefix}1`}
            emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
          />
        </div>
      )}
    </ExampleWrapper>
  );
}
