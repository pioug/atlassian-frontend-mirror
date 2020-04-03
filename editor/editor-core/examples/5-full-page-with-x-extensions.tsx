import React from 'react';
import { default as FullPageExample } from './5-full-page';
import { getXProductExtensionProvider } from '../example-helpers/fake-x-product-extensions';

export default () => (
  <FullPageExample
    extensionProviders={[getXProductExtensionProvider()]}
    allowExtension={{ allowNewConfigPanel: true }}
  />
);
