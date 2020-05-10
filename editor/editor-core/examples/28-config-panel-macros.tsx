import React from 'react';
import ConfigPanelWithExtensionPicker from '../example-helpers/config-panel/ConfigPanelWithExtensionPicker';
import { getConfluenceMacrosExtensionProvider } from '../example-helpers/confluence-macros';

import { combineExtensionProviders } from '@atlaskit/editor-common';
import EditorActions from '../src/actions';

const macroExtensionProvider = getConfluenceMacrosExtensionProvider(
  new EditorActions(),
);

export default function Example() {
  const extensionProvider = combineExtensionProviders([macroExtensionProvider]);

  return (
    <ConfigPanelWithExtensionPicker extensionProvider={extensionProvider} />
  );
}
