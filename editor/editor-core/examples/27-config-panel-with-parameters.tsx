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
  'date-start': '2020-01-18',
  'enum-select': 'a',
  'enum-select-icon': ['b', 'c', 'd'],
  'enum-select-icon-multiple': 'b',
  'enum-checkbox-multiple': ['a', 'b'],
  'fieldset-cql': 'created-at = now(-1w) AND query = foobar AND flag = BF',
  'fieldset-jira-filter':
    'keywords = editor AND project = editor-platform AND status = to-do',
  'custom-required': 'meeting-notes',
  'custom-create-multiple': ['XR', 'FF'],
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
