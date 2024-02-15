import React from 'react';

import {
  combineExtensionProviders,
  DefaultExtensionProvider,
} from '@atlaskit/editor-common/extensions';

import ConfigPanelWithExtensionPicker from '../example-utils/config-panel/ConfigPanelWithExtensionPicker';
import exampleManifest from '../example-utils/config-panel/example-manifest-individual-fields';

const parameters = {};
const extensionProvider = combineExtensionProviders([
  new DefaultExtensionProvider([exampleManifest]),
]);

export default function Example() {
  return (
    <ConfigPanelWithExtensionPicker
      extensionProvider={extensionProvider}
      parameters={parameters}
    />
  );
}
