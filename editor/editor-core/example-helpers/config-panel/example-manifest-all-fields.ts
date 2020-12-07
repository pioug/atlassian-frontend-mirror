import {
  ExtensionManifest,
  ExtensionModuleNodes,
  ExtensionModule,
} from '@atlaskit/editor-common';
import { setSmartUserPickerEnv } from '@atlaskit/user-picker';

import { mockFieldResolver } from './confluence-fields-data-providers';

import { cqlSerializer, cqlDeserializer } from './cql-helpers';

import { nativeFields, customFields } from './fields';

const exampleFields = [...nativeFields, ...customFields];

const key = 'allFields';

const quickInsert: ExtensionModule[] = [
  {
    key,
    title: 'All fields',
    icon: () => import('@atlaskit/icon/glyph/editor/code'),
    action: {
      type: 'node',
      key,
      parameters: {},
    },
  },
];

const nodes: ExtensionModuleNodes = {
  [key]: {
    type: 'extension',
    render: () => Promise.resolve(() => null),
    getFieldsDefinition: () => Promise.resolve(exampleFields),
  },
};

const manifest: ExtensionManifest = {
  title: 'Editor fields example',
  type: 'twp.editor.example',
  key: 'example-fields',
  description: 'Example of fields supported by the editor',
  icons: {
    '48': () => import('@atlaskit/icon/glyph/editor/code'),
  },
  modules: {
    quickInsert,
    nodes,
    fields: {
      custom: {
        'mock-resolver': {
          resolver: mockFieldResolver,
        },
      },
      fieldset: {
        cql: {
          serializer: cqlSerializer,
          deserializer: cqlDeserializer,
        },
      },
      user: {
        'user-jdog-provider': {
          provider: async () => {
            // WARNING: this is required by the SmartUserPicker for testing environments
            setSmartUserPickerEnv('local');

            return {
              siteId: '497ea592-beb4-43c3-9137-a6e5fa301088',
              principalId: 'Context',
              fieldId: 'storybook',
              productKey: 'jira',
            };
          },
        },
      },
    },
  },
};

export default manifest;
