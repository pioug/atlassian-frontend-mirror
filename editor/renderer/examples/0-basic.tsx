import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { Provider, Client } from '@atlaskit/smart-card';

export default function Example() {
  return (
    <Provider client={new Client('staging')}>
      <RendererDemo allowColumnSorting={true} serializer="react" />
    </Provider>
  );
}
