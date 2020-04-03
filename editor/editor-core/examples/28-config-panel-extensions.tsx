import React from 'react';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';

import ConfigPanelWithExtensionPicker from '../example-helpers/config-panel/ConfigPanelWithExtensionPicker';
import { getXProductExtensionProvider } from '../example-helpers/fake-x-product-extensions';

export default function Example() {
  const extensionProvider = combineExtensionProviders([
    getXProductExtensionProvider(),
  ]);

  return (
    <ConfigPanelWithExtensionPicker extensionProvider={extensionProvider} />
  );
}
