import React from 'react';
import { JsonLd } from 'json-ld-types';
import { Card, Client, Provider, TitleBlock } from '../../src';
import { url } from './example-responses';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve({
      meta: {
        visibility: 'not_found',
        access: 'forbidden',
      },
      data: {},
    } as JsonLd.Response);
  }
}

export default () => (
  <Provider client={new CustomClient('stg')}>
    <Card
      appearance="inline"
      ui={{ hideBackground: true, hideElevation: true, hidePadding: true }}
      url={url}
    >
      <TitleBlock />
    </Card>
  </Provider>
);
