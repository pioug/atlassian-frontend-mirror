import React from 'react';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ConnectedReactionsView, ConnectedReactionPicker } from '../src';
import { ReactionsExampleWrapper, setupPublisher } from './examples-utils';

const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

/**
 * The version from package.json file
 */
const { version } = require('../package.json');

// /**
//  * The publisher will be set up in product side in the real world, We add it in the example here so we can see events coming from UFO in the console browser object
//  */
setupPublisher({ product: 'reactions-demo', version });
// UFO.setLogger(true);

export default function Example() {
  return (
    <ReactionsExampleWrapper>
      {(store) => (
        <>
          <h4>
            Reactions container with UFO experience enabled. You can see events
            been dispatched in the console.log under `ufoEvent` wrapper
          </h4>
          <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h5>Simple Reactions picker wrapper</h5>
              <div style={{ marginTop: '10px' }}>
                <ConnectedReactionPicker
                  store={store}
                  containerAri={containerAri}
                  ari={demoAri}
                  emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
                />
              </div>
            </div>
            <hr />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h5>A reactions list wrapper with a picker wrapper</h5>
              <div style={{ marginTop: '10px' }}>
                <ConnectedReactionsView
                  store={store}
                  containerAri={containerAri}
                  ari={demoAri}
                  emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </ReactionsExampleWrapper>
  );
}
