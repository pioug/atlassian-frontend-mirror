import React from 'react';

import {
  combineExtensionProviders,
  DefaultExtensionProvider,
} from '@atlaskit/editor-common';
import exampleManifest from '../example-helpers/config-panel/example-manifest-all-fields';

import ConfigPanelWithExtensionPicker from '../example-helpers/config-panel/ConfigPanelWithExtensionPicker';

const parameters = {
  'text-field': 'Hi',
  'text-field-multiline': 'Hello\nWorld',
  'text-field-optional': '',
  'text-field-hidden': 'this is a hidden value passed to the extension',
  'number-field': '1234567',
  'start-date': '2020-01-18',
  'enum-select': 'a',
  'enum-select-icon': ['b', 'c', 'd'],
  'enum-select-icon-multiple': 'b',
  'enum-checkbox-multiple': ['a', 'b'],
  cql: 'Q = editor AND USER = llemos AND SPACE = FF',
  'jira-filter':
    'keywords = editor AND project = editor-platform AND status = to-do',
  'custom-label': 'meeting-notes',
  'custom-space-key': 'XR',
  'custom-space-key-multi': ['XR', 'FF'],
  'custom-user': 'llemos',
  'custom-user-lazy': 'akumar',
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
