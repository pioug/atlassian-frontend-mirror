import React from 'react';
import { payloadPublisher } from '@atlassian/ufo';
import { ufologger } from '@atlaskit/ufo/logger';

import { default as FullPageExample } from './5-full-page';

/**
 * The publisher will be set up in product side in the real world
 * We add it in the example here so we can see events coming from UFO in the console
 */
payloadPublisher.setup({
  product: 'examples',
  gasv3: {
    sendOperationalEvent: (event) => {
      console.log('sendOperationalEvent:', event);
    },
  },
  app: { version: { web: 'unknown' } },
});
ufologger.enable();

const editorProps = {
  featureFlags: { ufo: true },
};

export default () => <FullPageExample editorProps={editorProps} />;
