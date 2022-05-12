import React from 'react';
import { Provider, Client } from '../src';
import { CardSSR } from '../src/ssr';
import { url, cardState } from '@atlaskit/media-test-helpers/smart-card-state';
import { CardProviderStoreOpts } from '@atlaskit/link-provider';

const storeOptions: CardProviderStoreOpts = {
  initialState: {
    [url]: cardState,
  },
};

export default () => (
  <Provider storeOptions={storeOptions} client={new Client('stg')}>
    <div style={{ width: '680px', margin: '0 auto', marginTop: '64px' }}>
      <CardSSR appearance="inline" url={url} />
    </div>
  </Provider>
);
