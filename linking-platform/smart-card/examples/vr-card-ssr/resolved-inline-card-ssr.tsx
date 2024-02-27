import React from 'react';
import { Provider, Client } from '../../src';
import { CardSSR } from '../../src/ssr';
import { url, cardState } from '../utils/smart-card-ssr-state';
import { CardProviderStoreOpts } from '@atlaskit/link-provider';

const storeOptions: CardProviderStoreOpts = {
  initialState: {
    [url]: cardState,
  },
};

export default () => (
  <Provider storeOptions={storeOptions} client={new Client('stg')}>
    <CardSSR appearance="inline" url={url} />
  </Provider>
);
