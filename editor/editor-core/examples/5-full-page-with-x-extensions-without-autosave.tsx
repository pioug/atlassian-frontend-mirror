import React from 'react';
import { default as FullPageExample } from './5-full-page';
import { getXProductExtensionProvider } from '../example-helpers/fake-x-product-extensions';
import { getConfluenceMacrosExtensionProvider } from '../example-helpers/confluence-macros';

export default () => (
  <FullPageExample
    extensionProviders={editorActions => [
      getXProductExtensionProvider(),
      getConfluenceMacrosExtensionProvider(editorActions),
    ]}
    allowExtension={{ allowAutoSave: false }}
  />
);
