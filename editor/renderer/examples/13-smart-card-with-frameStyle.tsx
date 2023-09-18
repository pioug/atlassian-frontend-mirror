import React from 'react';

import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card-embed.adf.json';

export default function Example() {
  return (
    <SmartCardProvider client={new CardClient('stg')}>
      <Renderer
        document={document}
        appearance="full-page"
        smartLinks={{
          frameStyle: 'hide',
        }}
      />
    </SmartCardProvider>
  );
}
