import React from 'react';
import { JsonLd } from 'json-ld-types';
import { Card, Client, Provider, SmartLinkSize, TitleBlock } from '../../src';
import { response1 } from './example-responses';

class CustomClient extends Client {
  fetchData(url: string) {
    return Promise.resolve(response1 as JsonLd.Response);
  }
}

export default () => (
  <Provider client={new CustomClient('stg')}>
    <Card
      appearance="inline"
      ui={{ size: SmartLinkSize.Medium }}
      url={response1.data.url}
    >
      <TitleBlock />
    </Card>
  </Provider>
);
