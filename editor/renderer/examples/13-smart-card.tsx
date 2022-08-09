import React from 'react';

import { default as Renderer } from '../src/ui/Renderer';
import document from './helper/smart-card.adf.json';
import { SmartCardProvider } from '@atlaskit/link-provider';

export default function Example() {
  return (
    <SmartCardProvider>
      <Renderer document={document} appearance="full-page" />
    </SmartCardProvider>
  );
}
