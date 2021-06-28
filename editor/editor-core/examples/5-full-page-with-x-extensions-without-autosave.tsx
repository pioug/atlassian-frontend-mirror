import React from 'react';
import { getExampleExtensionProviders } from '../example-helpers/get-example-extension-providers';
import { default as FullPageExample } from './5-full-page';

export default () => (
  <FullPageExample
    extensionProviders={(editorActions) => [
      getExampleExtensionProviders(editorActions),
    ]}
    allowExtension={{ allowAutoSave: false }}
  />
);
