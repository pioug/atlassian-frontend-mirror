import React from 'react';

import {
  combineExtensionProviders,
  DefaultExtensionProvider,
} from '@atlaskit/editor-common';
import exampleManifest from '../example-helpers/config-panel/example-manifest-all-fields';

import ConfigPanelWithExtensionPicker from '../example-helpers/config-panel/ConfigPanelWithExtensionPicker';

const parameters = {
  'free-text-field': 'Hi',
  'number-field': '1234567',
  'text-non-required': '',
  'hidden-text-field': 'this is a hidden value passed to the extension',
  'start-date': '2020-01-18',
  'multiple-options-select-single-choice': 'a',
  'multiple-options-select-multiple-choice': ['b', 'c', 'd'],
  'multiple-options-checkbox-single-choice': 'b',
  'multiple-options-checkbox-multiple-choice': ['a', 'b'],
  label: 'meeting-notes',
  user: 'llemos',
  'space-key': 'XR',
  spaces: ['XR', 'FF'],
  cql: 'Q = editor AND USER = llemos AND SPACE = FF',
  'jira-filter':
    'keywords = editor AND project = editor-platform AND status = to-do',
  'user-lazy': 'akumar',
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
