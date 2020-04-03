import React from 'react';
import ConfigPanelWithExtensionPicker from '../example-helpers/config-panel/ConfigPanelWithExtensionPicker';
import { getConfluenceMacrosExtensionProvider } from '../example-helpers/confluence-macros';

import { combineExtensionProviders } from '@atlaskit/editor-common';

const macroExtensionProvider = getConfluenceMacrosExtensionProvider();

export default function Example() {
  const extensionProvider = combineExtensionProviders([macroExtensionProvider]);

  return (
    <ConfigPanelWithExtensionPicker extensionProvider={extensionProvider} />
  );
}
