import React from 'react';

import { getXProductExtensionProvider } from '../example-helpers/fake-x-product-extensions';
import { getConfluenceMacrosExtensionProvider } from '../example-helpers/confluence-macros';

import { default as FullPageExample } from './5-full-page';

export default () => (
  <FullPageExample
    macroProvider={undefined}
    extensionProviders={editorActions => [
      getXProductExtensionProvider(),
      getConfluenceMacrosExtensionProvider(editorActions),
    ]}
    allowExtension={{ allowAutoSave: true, allowLocalIdGeneration: true }}
    elementBrowser={{ showModal: true, replacePlusMenu: true }}
    insertMenuItems={[]}
  />
);
