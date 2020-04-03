import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card.adf.json';
import { Provider } from '@atlaskit/smart-card';

export default function Example() {
  return (
    <Provider>
      <Renderer document={document} appearance="full-page" />
    </Provider>
  );
}
