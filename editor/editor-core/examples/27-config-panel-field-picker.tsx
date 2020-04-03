import React from 'react';

import {
  combineExtensionProviders,
  DefaultExtensionProvider,
} from '@atlaskit/editor-common';
import exampleManifest from '../example-helpers/config-panel/example-manifest-individual-fields';

import ConfigPanelWithExtensionPicker from '../example-helpers/config-panel/ConfigPanelWithExtensionPicker';

const parameters = {
  cql:
    'Q = dddd AND USER = llemos AND SPACE = SD AND contentType in (blogpost, question)',
};

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
