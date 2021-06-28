import React from 'react';
import { getExampleExtensionProviders } from '../example-helpers/get-example-extension-providers';

import { default as FullPageExample } from './5-full-page';

export default () => (
  <FullPageExample
    macroProvider={undefined}
    extensionProviders={(editorActions) => [
      getExampleExtensionProviders(editorActions),
    ]}
    allowExtension={{
      allowAutoSave: true,
      allowExtendFloatingToolbars: true,
    }}
    elementBrowser={{
      showModal: true,
      replacePlusMenu: true,
      helpUrl:
        'https://support.atlassian.com/confluence-cloud/docs/what-are-macros/',
    }}
    insertMenuItems={[]}
  />
);
